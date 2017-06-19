$(document).ready(function() {
  $('.delete').click(deleteChallenge);


  function deleteChallenge() {
    var isSure = confirm("Are you sure?");
    if (isSure) {
      $('#c' + $(this).data('id')).hide();
      $.ajax({
        type: 'POST',
        url: '/c/d/' + $(this).data('id')
      }).done(function(response) {
        window.location.replace('/profile');
      });
        window.location.replace('/profile');
      } else {
        return false;
      };
  };

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
