watch( '.html$') {|match_data|
  `couchapp push dev` unless match_data[0] =~ /\.sw.$/
}
watch( '.js$') {|match_data|
  `couchapp push dev` unless match_data[0] =~ /\.sw.$/
}
watch( '.*\.json$') {|match_data|
  `couchapp push dev` unless match_data[0] =~ /\.sw.$/
}
watch( '.*\.css$') {|match_data|
  `couchapp push dev` unless match_data[0] =~ /\.sw.$/
}
watch( '(.*\.coffee$)' ) {|match_data|
  puts match_data[0]
  result = `coffee --bare --compile #{match_data[0]} 2>&1`
  error = false
  result.each{|line|
    if line.match(/In /)  then
      error = true
      puts line
#      `mplayer -really-quiet "/usr/share/evolution/2.30/sounds/default_alarm.wav"`
#      `notify-send "#{line}" -i /usr/share/icons/Humanity/status/128/dialog-warning.svg &`
    end
  }
  if not error
    puts "Success!"
#    `make combined`
    `couchapp push dev`
  end
}
