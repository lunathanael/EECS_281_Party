document.addEventListener('DOMContentLoaded', function () {
    // Get references to the slider elements and display values
    const particlesSlider = document.getElementById('particles');
    const spreadSlider = document.getElementById('spread');
    const sizeSlider = document.getElementById('size');
    const durationSlider = document.getElementById('duration');
  
    const particlesValue = document.getElementById('particles-value');
    const spreadValue = document.getElementById('spread-value');
    const sizeValue = document.getElementById('size-value');
    const durationValue = document.getElementById('duration-value');
  
    // Load stored values from chrome.storage
    chrome.storage.sync.get(['particles', 'spread', 'size', 'duration'], function (data) {
      particlesSlider.value = data.particles || 150;
      spreadSlider.value = data.spread || 200;
      sizeSlider.value = data.size || 12;
      durationSlider.value = data.duration || 300;
  
      particlesValue.innerText = particlesSlider.value;
      spreadValue.innerText = spreadSlider.value;
      sizeValue.innerText = sizeSlider.value;
      durationValue.innerText = durationSlider.value;
    });
  
    // Update the display text when the slider values change
    particlesSlider.oninput = function () {
      particlesValue.innerText = this.value;
    };
    spreadSlider.oninput = function () {
      spreadValue.innerText = this.value;
    };
    sizeSlider.oninput = function () {
      sizeValue.innerText = this.value;
    };
    durationSlider.oninput = function () {
      durationValue.innerText = this.value;
    };
  
    // Save the settings when the "Save Settings" button is clicked
    document.getElementById('saveBtn').addEventListener('click', function () {
      const particles = particlesSlider.value;
      const spread = spreadSlider.value;
      const size = sizeSlider.value;
      const duration = durationSlider.value;
  
      chrome.storage.sync.set({
        particles: particles,
        spread: spread,
        size: size,
        duration: duration
      }, function () {
        // console.log('Settings saved.');
      });
    });
  });
  