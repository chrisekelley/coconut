def push_and_test
  puts "This script uses each_line from Ruby 1.9. Change to each if using Ruby 1.8."
#    `make combined`
  `git log --pretty=format:'%h' -n 1 > _attachments/version`
  `couchapp push`
#  `couchapp push http://coco:cocopuffs@localhost:5984/coconut-factory`
#  `pkill cucumber`
#  sleep(2)
#  puts "starting cuke"
#  cuke_result = `cucumber`
#  puts cuke_result
#  `notify-send "Cucumber fail" -i /usr/share/icons/Humanity/status/128/dialog-warning.svg &` if cuke_result.match(/fail/i)

end

push_and_test()

watch( '.html$') {|match_data|
  push_and_test()
}
watch( '.js$') {|match_data|
  push_and_test()
}
watch( '.*\.json$') {|match_data|
  push_and_test()
}
watch( '.css$') {|match_data|
  push_and_test()
}
watch( '(.*\.coffee$)' ) {|match_data|
  puts "\n"
  puts match_data[0]
  result = `coffee --bare --compile #{match_data[0]} 2>&1`
  error = false
  result.each_line{|line|
    if line.match(/In /)  then
      error = true
      puts line
#      `mplayer -really-quiet "/usr/share/evolution/2.30/sounds/default_alarm.wav"`
#      `notify-send "#{line}" -i /usr/share/icons/Humanity/status/128/dialog-warning.svg &`
    end
  }
  if not error
    push_and_test()
  end
}

