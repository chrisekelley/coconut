---
index: 11
layout: guide
title: Conflicts
sidebar: guides_nav.html
---

Conflicts are an unavoidable reality when dealing with distributed systems. And make no mistake: client-server *is* a distributed system.

CouchDB and PouchDB differ from many other sync solutions, because they bring the issue of conflicts front-and-center. With PouchDB, conflict resolution is entirely under your control.

{% include alert/start.html variant="info" %}

PouchDB exactly implements CouchDB's replication algorithm, so conflict resolution works the same in both. For the purposes of this article, "CouchDB" and "PouchDB" may be used interchangeably.

{% include alert/end.html %}

Two types of conflicts
-------

In CouchDB, conflicts can occur in two places: immediately, when you try to commit a new revision, or later, when two peers have committed changes to the same document.

### Immediate conflicts

**Immediate conflicts** can occur with any API that can take a `rev` or a document with a `_rev` as input &ndash; `put()`, `post()`, `remove()`, `bulkDocs()`, and `putAttachment()`. They manifest as a `409` (conflict) error:

```js
var myDoc = {
  _id: 'someid',
  _rev: '1-somerev'
};
db.put(myDoc).then(function () {
  // success
}).catch(function (err) {
  if (err.status === 409) {
    // conflict!
  } else {
    // some other error
  }
});
```

In your code, *you should always be handling conflicts*. No matter how unlikely it may seem, 409s can and do occur.

For instance, if you are doing live replication, a document may be modified by somebody else while the user is working on it. If the remote changes are replicated to the local database before the user tries to commit their changes, then they will receive the above 409 error.

#### Upsert

In many cases, the most practical solution to the 409 problem is to retry the `put()` until it succeeds. If the user's intended change can be expressed as a **delta** (i.e. a change that doesn't depend on the current revision), then this is very easy to achieve.

Borrowing a phrase from MongoDB, let's call this an **upsert** ("update or insert"), and use the [pouchdb-upsert](https://github.com/pouchdb/pouchdb-upsert) plugin to implement it:

```js
function myDeltaFunction(doc) {
  doc.counter = doc.counter || 0;
  doc.counter++;
  return doc;
}

db.upsert('my_id', myDeltaFunction).then(function () {
  // success!
}).catch(function (err) {
  // error (not a 404 or 409)
});
```

This `upsert()` function takes a `docId` and `deltaFunction`, where the `deltaFunction` is just a function that takes a document and outputs a new document. (If the document does not exist, then an empty document is provided.)

`pouchdb-upsert` also offers a `putIfNotExists()` function, which will create a document if it doesn't exist already. For more details, see [the plugin's documentation](https://github.com/pouchdb/pouchdb-upsert#readme). 

### Non-immediate conflicts

Imagine two PouchDB databases have both gone offline. The two users each make modifications to the same document, and then come back online at the same time. They both committed changes to the same document, and their local databases did not throw 409 errors. What happens then?

This is the classic "conflict" scenario, and CouchDB handles it very elegantly. By default, CouchDB will choose an arbitrary winner based on a deterministic algorithm, which means both users will see the same winner once they're back online. However, since the replication history is stored, you can always go back in time to resolve the conflict.

To detect if a document is in conflict, you use the `{conflicts: true}` option when you `get()` it.

```js
db.get('docid', {conflicts: true}).then(function (doc) {
  // do something with the doc
}).catch(function (err) {
  // handle any errors
});
```

If the document has conflicts, then the `doc` will be returned with a `_conflicts` attribute, which may contain the IDs of conflicting revisions.

For instance, imagine the `doc` returned is the following:

```js
{
  "_id": "docid",
  "_rev": "2-f3d4c66dcd7596419c76b2498b3ba21f",
  "_conflicts": ["2-c1592ce7b31cc26e91d2f2029c57e621"]
}
```

Here we have a conflict introduced from another database, and that database's revision has arbitrarily won. This document's current revision starts with 2-, and the conflicting version also starts with 2-, indicating that they're both at the same level of the revision tree. (Recall that revision hashes start with `1-`, `2-`, `3-`, etc.)

Both databases will see the same conflict, assuming replication has completed. In fact, all databases in the network will see the exact same revision history &ndash; much like Git.

To fetch the losing revision, you simply `get()` it using the `rev` option:

```js
db.get('docid', {rev: '2-c1592ce7b31cc26e91d2f2029c57e621'}).then(function (doc) {
  // do something with the doc
}).catch(function (err) {
  // handle any errors
});
```

At this point, you can present both versions to the user, or resolve the conflict automatically using your preferred conflict resolution strategy: last write wins, first write wins, [RCS](https://www.gnu.org/software/rcs/), etc.

To mark a conflict as resolved, all you need to do is `remove()` the unwanted revisions. So for instance, to remove `'2-f3d4c66dcd7596419c76b2498b3ba21f'`, you would do:

```js
db.remove('docid', '2-f3d4c66dcd7596419c76b2498b3ba21f').then(function (doc) {
  // yay, we're done
}).catch(function (err) {
  // handle any errors
});
```

If you want to resolve the conflict by creating a new revision, you simply `put()` a new document on top of the current winner, and make sure that the losing revision is deleted.

{% include alert/start.html variant="info" %}
{% markdown %}
PouchDB deviates from CouchDB's replication algorithm in one small way: revision hashes aren't deterministic. PouchDB is forced to do this, because CouchDB calculates its revision hashes in an Erlang-specific way.

In practice, this just means that PouchDB's replication algorithm is slightly less efficient than CouchDB's, for some very unlikely edge cases. For details, see [this comment](https://github.com/pouchdb/pouchdb/issues/2451#issuecomment-77386826).
{% endmarkdown %}
{% include alert/end.html %}

Accountants don't use erasers
-------

Another conflict resolution strategy is to design your database so that conflicts are impossible. In practice, this means that you never update or remove existing documents &ndash; you only create new documents.

This strategy has been called the "every doc is a delta" strategy. A classic use-case for this would be a checkbook app, where every document is simply an operation that increases or decreases the account balance:

```js
{_id: new Date().toJSON(), change: 100} // balance increased by $100
{_id: new Date().toJSON(), change: -50} // balance decreased by $50
{_id: new Date().toJSON(), change: 200} // balance increased by $200
```

In this system, it is impossible for two documents to conflict, because the document `_id`s are just timestamps. Ledger transactions are recorded in the order they were made, and at the end of the day, you only need to do an `allDocs()` or `query()` operation to sum the result.

The wisdom of this strategy can be expressed by the maxim: ["Accountants don't use erasers"](http://blogs.msdn.com/b/pathelland/archive/2007/06/14/accountants-don-t-use-erasers.aspx). Like a diligent accountant, your app can just add new documents when you want to make a change, rather than going back and scrubbing out previous changes.

There is also a PouchDB plugin that implements this strategy: [delta-pouch](https://github.com/redgeoff/delta-pouch).

Next
-------

Now that we've settled our conflicts, let's take a look at the changes feed.
