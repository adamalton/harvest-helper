harvest-helper
==============

A Javascript file which adds colours and arrow key navigation to the harvestapp.com time sheet web application


## Installation

1. Install some kind of browser plugin such as Grease Monkey or Tampermonkey.
2. Give it this script (the comments at the top of the script are for Tampermonkey).
3. Enjoy (see Usage).


## Usage

This script groups the rows in Harvest based on the project name, and then colours rows from the same project in the same colour.

It also allows you to use the keyboard arrow keys to nagivate up/down/left/right between the rows/days.

Currently only works for the week view.


## Complaints

If you would like to make my Javascript less hacky then send me a pull request!

## TODO

* Make it work for the day view as well.
* Add more colours.
* Use less garish colours.
* Make the regex for matching the project name a bit better, or maybe configurable.
