def push_and_test
#    `make combined`
  `couchapp push`
  `pkill cucumber`
  sleep(2)
#  puts "starting cuke"
#  cuke_result = `cucumber`
#  puts cuke_result
#  `notify-send "Cucumber fail" -i /usr/share/icons/Humanity/status/128/dialog-warning.svg &` if cuke_result.match(/fail/i)

end

push_and_test()

watch( '.html$') {|match_data|
  push_and_test()
#  `couchapp push` unless match_data[0] =~ /\.sw.$/
}
watch( '.js$') {|match_data|
  push_and_test()
#  `couchapp push` unless match_data[0] =~ /\.sw.$/
}
watch( '.*\.json$') {|match_data|
  push_and_test()
#  `couchapp push` unless match_data[0] =~ /\.sw.$/
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
      `notify-send "#{line}" -i /usr/share/icons/Humanity/status/128/dialog-warning.svg &`
    end
  }
  if not error
    push_and_test()
  end
}

