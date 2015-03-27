var app = {
    name: "Ross Foran",
    version: "1.0.0",
    loadCount: 0,
    pages: [],
    people: [],
    wrapper: document.querySelector(".wrapper"),
    //    hammertime: null,
    contactLatitude: "",
    contactLongitude: "",
    modal: null,

    loadMap: function (ev) {

        if (navigator.geolocation) {
            var params = {
                enableHighAccuracy: true,
                timeout: 36000,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(watchPosition, gpsError, params);
        } else {
            console.log("Your Device does not Support Geolocation");
        }

        function watchPosition(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            initialize(latitude, longitude);

        }

        function gpsError(error) {
            var errors = {
                1: 'You need to enable location services for our app in settings',
                2: 'We were unable to determine your position.',
                3: 'It took too long to find your position.'
            };
            console.log("Error: " + errors[error.code]);
        }

        function initialize(latitude, longitude) {
            var latlng = new google.maps.LatLng(latitude, longitude);
            var myOptions = {
                zoom: 15,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"),
                myOptions);

            var location = new google.maps.LatLng(latitude, longitude);
            marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: "img/currentlocation.gif",
                draggable: true,
                animation: google.maps.Animation.DROP,
                animation: google.maps.Animation.BOUNCE
            });

            google.maps.event.addListener(map, 'click', function (event) {
                placeMarker(event.latLng);
            });

            function placeMarker(location) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: "img/house.png",
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });
            }

            function placeContactMarker() {
                var contactLocation = new google.maps.LatLng(contactLatitude, contactLongitude);
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: "img/house.png",
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });
            }

            function toggleBounce() {

                if (marker.getAnimation() != null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            google.maps.event.trigger(map, 'resize');
            //makes the map resize now that the container changed size.
            var reCenter = new google.maps.LatLng(latitude, longitude);
            map.setCenter(reCenter);
        }
    },

    closeModal: function () {
        var closeDiv = document.querySelector(".closeDiv");
        closeDiv.removeEventListener('click', app.closeModal, false);
        openModal.style.opacity = 0;
        openModal.style.display = "none";
    },

    hammerSingle: function (ev) {
        var id = ev.target.getAttribute('id');
        console.log(app.people[id].numbers[0].value);
        var modalWindow = document.querySelector('.modalContact');
        var openModal = document.querySelector('#openModal');
        modalWindow.innerHTML = "<p>" + app.people[id].name + "<br>" + app.people[id].numbers[0].value + "</p>";
        openModal.style.display = "block";
        openModal.style.opacity = 1;
        setTimeout(function () {
            var closeDiv = document.querySelector(".closeDiv");
            closeDiv.addEventListener('click', app.closeModal, false);
        }, 350);
    },

    hammerDouble: function (ev) {
        app.pages[0].className = "active";
        app.pages[1].className = "";
        var id = ev.target.getAttribute('id');
        contactLatitude = app.people[id].latitude;
        contactLongitude = app.people[id].longitude;
        app.loadMap(ev);
    },

    addListeners: function () {
        var numberList = "";
        //var contactList = document.querySelectorAll('.contactDiv');



        //            function hammerSingle(ev) {
        //                var id = ev.target.getAttribute('id');
        //                console.log(app.people[id].numbers[0].value);
        //                var modalWindow = document.querySelector('.modalContact');
        //                var openModal = document.querySelector('#openModal');
        //                modalWindow.innerHTML = "<p>" + app.people[id].name + "<br>" + app.people[id].numbers[0].value + "</p>";
        //                openModal.style.display = "block";
        //                openModal.style.opacity = 1;
        //                setTimeout(function () {
        //                    var closeDiv = document.querySelector(".closeDiv");
        //                    closeDiv.addEventListener('click', closeModal, false);
        //                }, 350);
        //            };

        /*function hammerDouble(ev) {
            hammertime.get('doubletap').recognizeWith('tap');
            var id = ev.target.getAttribute('id');
            contactLatitude = app.people[id].latitude;
            contactLongitude = app.people[id].longitude;
            loadMap(ev);
        };*/

        /*function closeModal() {
            var closeDiv = document.querySelector(".closeDiv");
            closeDiv.removeEventListener('click', closeModal, false);
            openModal.style.opacity = 0;
            openModal.style.display = "none";
        };*/



    },
    init: function () {
        document.addEventListener("DOMContentLoaded", this.deviceReady);
        document.addEventListener("deviceready", this.deviceReady);
    },
    deviceReady: function () {
        app.loadCount++;
        if (app.loadCount === 2) {
            app.domReady();
        }
    },
    domReady: function () {

        var contactInst = document.querySelector(".contact");

        app.pages.push(document.getElementById("location"));
        app.pages.push(document.getElementById("contact"));

        /*var buttonLocation = document.querySelector(".contactDiv");*/
        var buttonHome = document.querySelector(".back");

        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        filter = ["displayName", "phoneNumbers"];

        // find contacts
        navigator.contacts.find(filter, onSuccess, onError, options);

        function onSuccess(matches) {
            var contactsContainer = document.querySelector('.contactDiv');
            for (var i = 0; i < 12; i++) {

                var contactInfo = {};
                contactInfo.name = matches[i].displayName;
                contactInfo.numbers = [];
                for (var p = 0; p < matches[i].phoneNumbers.length; p++) {
                    contactInfo.numbers.push(matches[i].phoneNumbers[p]);
                }
                contactInfo.contactLatitude = '';
                contactInfo.contactLongitude = '';
                //console.log(JSON.parse(localStorage.getItem(contact[i])));
                app.people.push(contactInfo);
            };
            localStorage.setItem("contactsArray", JSON.stringify(app.people));
            displayContacts();

        }

        function onError() {
            alert("Contacts Not Found");
        }

        function displayContacts() {
            var putThemHere = document.querySelector('.contactDiv');
            for (i = 0; i < 12; i++) {
                //var li = '<li class="contact' +  + '">Name: ' + app.people[i].name + '</li>' ;
                var li = document.createElement("li");
                li.className = "contact";
                li.id = i;
                li.innerHTML = app.people[i].name;
                putThemHere.appendChild(li);
            }
            app.addListeners();
        }

        buttonHome.addEventListener("click", function () {
            app.pages[0].className = "";
            app.pages[1].className = "active";
        });
        /*
        buttonLocation.addEventListener("click", function () {
            app.pages[0].className = "active";
            app.pages[1].className = "";
            loadMap();

        });*/

        /*function loadMap(ev) {

            if (navigator.geolocation) {
                var params = {
                    enableHighAccuracy: true,
                    timeout: 36000,
                    maximumAge: 0
                };
                navigator.geolocation.getCurrentPosition(watchPosition, gpsError, params);
            } else {
                console.log("Your Device does not Support Geolocation");
            }

            function watchPosition(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                initialize(latitude, longitude);

            }

            function gpsError(error) {
                var errors = {
                    1: 'You need to enable location services for our app in settings',
                    2: 'We were unable to determine your position.',
                    3: 'It took too long to find your position.'
                };
                console.log("Error: " + errors[error.code]);
            }

            function initialize(latitude, longitude) {
                var latlng = new google.maps.LatLng(latitude, longitude);
                var myOptions = {
                    zoom: 15,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map-canvas"),
                    myOptions);

                var location = new google.maps.LatLng(latitude, longitude);
                marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: "img/currentlocation.gif",
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    animation: google.maps.Animation.BOUNCE
                });

                google.maps.event.addListener(map, 'click', function (event) {
                    placeMarker(event.latLng);
                });

                function placeMarker(location) {
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map,
                        icon: "img/house.png",
                        draggable: true,
                        animation: google.maps.Animation.DROP
                    });
                }

                function placeContactMarker() {
                    var contactLocation = new google.maps.LatLng(contactLatitude, contactLongitude);
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map,
                        icon: "img/house.png",
                        draggable: true,
                        animation: google.maps.Animation.DROP
                    });
                }

                function toggleBounce() {

                    if (marker.getAnimation() != null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }

                google.maps.event.trigger(map, 'resize');
                //makes the map resize now that the container changed size.
                var reCenter = new google.maps.LatLng(latitude, longitude);
                map.setCenter(reCenter);
            }
        }*/

    }




}

app.init();

function testme() {

    console.log('yay');
    var contactList = document.querySelector('.contactDiv');
    // for (var i = 0; i < contactList.length; i++) {
    var hammertime = new Hammer.Manager(contactList);

    hammertime.add(new Hammer.Tap({
        event: 'doubletap',
        taps: 2
    }));
    hammertime.add(new Hammer.Tap({
        event: 'singletap'
    }));
    hammertime.get('doubletap').recognizeWith('singletap');
    hammertime.get('singletap').requireFailure('doubletap');

    hammertime.on('doubletap', function (ev) {
        app.hammerDouble(ev);

    })
    hammertime.on('singletap', function (ev) {

        app.hammerSingle(ev);
    })

}

testme();