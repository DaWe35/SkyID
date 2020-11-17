//the helper function
let createCopy = function(textToCopy, triggerElementId, callback = null) {
    //add event listner to elementtrigger
    let trigger = document.getElementById(triggerElementId);
    trigger.addEventListener("click", function() {
      //create the readonly textarea with the text in it and hide it
      let tarea = document.createElement("textarea");
      tarea.setAttribute("id", triggerElementId + "-copyarea");
      tarea.setAttribute("readonly", "readonly");
      tarea.setAttribute(
        "style",
        "opacity: 0; position: absolute; z-index: -1; top: 0; left: -9999px;"
      );
      tarea.appendChild(document.createTextNode(textToCopy));
      document.body.appendChild(tarea);

      //select and copy the text in the readonly text area
      tarea.select();
      document.execCommand("copy");

      //remove the element from the DOM
      document.body.removeChild(tarea);

      //fire callback function if provided
      if (typeof callback === "function" && callback()) {
        callback();
      }
    });
  };


//   usage example
//   createCopy('Sample text to copy', 'elementId', function () {
//       alert('A callback function to show your text was copied successfully!');
//   });
