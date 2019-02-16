$(function() {
  var tab = $('#ftab'),
      ftitle = $('.ctitle');
  
  tab.mouseover(function() {
    tab.animate({
      'width': "10em"
    }, 300 );
    ftitle.animate({
      'margin-left': "7.5em"
    }, 290 );
  });
  
  tab.mouseleave(function() {
    tab.animate({
      'width': '1.5em'
    }, 300)
    ftitle.animate({
      'margin-left': "-0.9em"
    }, 290 );
  });
});