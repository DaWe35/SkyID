function docLoaded() {
  if (window.innerWidth >= 768) {
    alert("This page was not designed for your device. You will be redirected");
    window.location.replace("login.html");
  }

  document.getElementById("loginAltButton").addEventListener("click", function() {
    window.location.href = "login.html";
  });

  setInterval(function() {
    if (window.innerWidth <= 768 && (window.innerWidth > window.innerHeight)) {
      document.getElementById("message").style.display = "flex";
    }
    else {
      document.getElementById("message").style.display = "none";
    }
  }, 100);
}
