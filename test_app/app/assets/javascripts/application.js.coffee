#= require jquery
#= require jquery_ujs
#= require ./vendor/underscore
#= require ./vendor/backbone
#= require ./vendor/modernizr
#= require ./vendor/jquery-ui
#= require ./backbone/prolepsis
#= require ./backbone/project
#= require ./backbone/init
#= require ./rails-sort

$ ->
  # jQueryUI tabs
  ($ '.tabs').tabs()

  setTimeout(
    ->
      # sortable lists
      ($ '.sortable').railsSort()
    100
  )
