$(document).ready(function() {
  $('.delete').click(deleteChallenge);

  if (screen.width < 768) {
    $('.sidebar').addClass('hide');
    $('.sidebar-toggle').removeClass('hide');

    $('.sidebar-toggle').click(function() {
      $('.sidebar').toggleClass('hide');
    });

  } else {
    $('.sidebar').removeClass('hide');
    $('.sidebar-toggle').addClass('hide');
  }


  function deleteChallenge() {
    var isSure = confirm("Are you sure?");
    if (isSure) {
      $('#c' + $(this).data('id')).hide();
      $.ajax({
        type: 'POST',
        url: '/c/d/' + $(this).data('id')
      }).done(function(response) {
        //window.location.replace('/profile');
      });
        //window.location.replace('/profile');
      } else {
        return false;
      };
  };

  $('#c-go-body').click(function() {
    $(this).addClass('active');
    $('#c-go-solutions').removeClass('active');
    $('#c-go-files').removeClass('active');
    $('#files').addClass('hide');
    $('#solutions').addClass('hide');
    $('#body').removeClass('hide');
  });

  $('#c-go-files').click(function() {
    $(this).addClass('active');
    $('#c-go-solutions').removeClass('active');
    $('#c-go-body').removeClass('active');
    $('#body').addClass('hide');
    $('#solutions').addClass('hide');
    $('#files').removeClass('hide');
  });

  $('#c-go-solutions').click(function() {
    $(this).addClass('active');
    $('#c-go-files').removeClass('active');
    $('#c-go-body').removeClass('active');
    $('#files').addClass('hide');
    $('#body').addClass('hide');
    $('#solutions').removeClass('hide');
  });


});
      // fetch("/api/challenges/" + $('#div1').data('user')) // Call the fetch function passing the url of the API as a parameter
      //   .then((resp) => resp.json())
      //   .then(function(data) {
      //     data.map(function(datum) {
      //       var txt1 = "<p>" + datum.title + "</p>";
      //       var txt3 = document.createElement("div");
      //       $(".my_challenges").append(txt1, txt3);     // Append new elements
      //     });
      //   })
      //   .catch(function(err) {
      //       console.log(err);
      // });
      // $("#div1").load("/api/challenges/" + $('#div1').data('user'), function(responseTxt, statusTxt, xhr){
      //     if(statusTxt == "success")
      //       console.log("External content loaded successfully!");
      //     if(statusTxt == "error")
      //         alert("Error: " + xhr.status + ": " + xhr.statusText);
      // });

  //   }
  //
  // }

/*
	$('.navbar-search-input').focus(function() {
		$('.navbar-search-input').css("width", '550px');
	});
*/
// });
