(function() {
    'use strict';

    function _getBgColor(element) {
        if (element.currentStyle) {
            return element.currentStyle.backgroundColor;
        }
        if (window.getComputedStyle) {
            var elementStyle=window.getComputedStyle(element, '');
            if (elementStyle) {
                return elementStyle.getPropertyValue('background-color');
            }
        }
        return 0;
    }

    function _forEach(obj, callback) {
        var item;
        for (item in obj) {
            if (obj.hasOwnProperty(item)) {
                callback(obj[item]);
            }
        }
    }

    function _sliderInit() {
        var sliders = document.querySelectorAll('input[class*="range_"]');
        var slider_submit = document.getElementsByClassName('slider_submit')[0];
        slider_submit.addEventListener('click', function(evt) {
            _handleSliderSend(evt, sliders);
        });
        _forEach(sliders, function(slider) {
            slider.addEventListener('input', _handleSliderInput, false);
        });
    }

    function _handleSliderInput(evt) {
        evt.preventDefault();
        _updateSliderPreview(evt);
        return _showSliderValue(evt.target.className, evt.target.value);
    }

    function _handleSliderSend(evt, sliders) {
        evt.preventDefault();
        var colorCode = [];
        _forEach(sliders, function(slider) {
            colorCode.push(slider.value);
        });
        return _parseColorArray(colorCode.join());
    }

    function _updateSliderPreview(evt) {
        var slider_preview = document.getElementsByClassName('slider_preview')[0];
        var updatedColor = evt.target.name.charAt(0);
        var currentRGB = _getBgColor(slider_preview).match(/\d+/g);
        var r = updatedColor === 'r' ? evt.target.value : currentRGB[0];
        var g = updatedColor === 'g' ? evt.target.value : currentRGB[1];
        var b = updatedColor === 'b' ? evt.target.value : currentRGB[2];
        var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
        return slider_preview.style.backgroundColor = rgb;
    }

    function _showSliderValue(elem, value) {
        var outputElem = document.getElementsByClassName(elem + '_output')[0];
        return outputElem.innerHTML = value;
    }

    function _parseColorArray(message) {
        var m = message.split(',');
        var hex = '';
        var i = 0;
        var l = m.length;
        for(; i < l; i += 1) {
            var n = parseInt(m[i].trim());
            if (n < 16) {
                hex += '0' + n;
            } else {
                hex += n.toString(16);
            }
        }
        return _doPost(hex);
    }

    function _doPost(colorCode) {
        // get accessToken and deviceID from: https://build.particle.io/build
        var accessToken = 'ACCESSTOKEN';
        var deviceID = 'DEVICEID';
        var apiUrl = 'https://api.spark.io/v1/devices/' + deviceID + '/led';

        fetch(apiUrl, {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: 'params=' + colorCode + '&access_token=' + accessToken
        })
        .then(function(res) {
            if (res.ok) {
                return console.debug('success: ', res);
            }
            return console.error('error: ', res);
        })
        .catch(function(err) {
            console.error('error: ', err);
        });
    }

    function _init() {
        _sliderInit();
    }
    _init();

}());
