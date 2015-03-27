wrapper: document.querySelector('.wrapper'),
  mc: null,
  modal:null,
  addListeners: function(){
    app.mc = new Hammer(app.wrapper, {});
    var singleTap = new Hammer.Tap({ event: 'tap' });
    var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
    app.mc.add([doubleTap, singleTap]);
    doubleTap.requireFailure(singleTap);
    
		app.mc.on("tap", function(ev){
      //single tap
    	ev.target.textContent = ev.type +" gesture detected.";
      app.modal = document.getElementById("openModal");
      app.modal.style.display = "block";
    });
    app.mc.on("doubletap", function(ev){
      //double tap
    	ev.target.textContent = ev.type +" gesture detected.";
      app.modal = document.getElementById("double");
      app.modal.style.display = "block";
    }); 
    
  }