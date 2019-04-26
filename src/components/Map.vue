<template>
  <div id="mapComponent">
    <div id="renderMap"></div>
    <div v-show="showCarousel" class="carouselMap">
      <p>{{shopName}}</p>
      <p>{{shopAddress}}</p>
      <slick  ref="slick" :options="slickOptions">
        <img
          class="sizing"
          v-bind:key="index"
          v-for="(shop, index) in shops"
          v-bind:class="{shopBorder: isSelected === shop.name}"
          v-bind:src="shop.image"
          v-on:click="selectShop(shop.name, shop.address, shop.position, index)"
        >
      </slick>
    </div>
  </div>
</template>

<script>
// import bs from "../../services/bs_api.js";
import gmapsInit from "../utils/gmaps";
import shops from "./apiShops";
import Slick from "vue-slick";
import "../assets/css/slick.css";

export default {
  name: "HelloWorld",
  components: {
    slick: Slick
  },
  data() {
    return {
      showCarousel: false,
      slickOptions: {
        slidesToShow: 1,
        accessibility: true,
        centerMode: true,
        draggable: true,
        infinite: false,
        arrows: false,
        mobileFirst: true
      },
      google: "",
      map: "",
      shops: shops,
      shopName: "",
      shopAddress: "",
      geolocMarker: [],
      isSelected: "",
      markers: [],
      previous: {
        name: "",
        marker: ""
      }
    };
  },
  methods: {
    selectShop(name, address, position, index) {
      this.$refs.slick.goTo(index);
      const map = this.map;
      const google = this.google;
      map.setZoom(14);
      map.panTo(position);
      this.shopName = name;
      this.shopAddress = address;
      this.isSelected = name;

      const marker = this.markers.filter(el => el.name === name)[0];
      if(this.previous.name){
        if(this.previous.name !== name){
          this.previous.marker.setIcon('https://www.google.com/mapfiles/marker_purple.png');
        }
      }
      marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
      this.previous.name = name;
      this.previous.marker = marker;
    },

    getShopsMarkers() {
      const google = this.google;
      const map = this.map;

      const icon = 'https://www.google.com/mapfiles/marker_purple.png';
      const markers = shops.map((shop, i) => {
        const marker = new google.maps.Marker({ ...shop, icon, map });
        marker.addListener("click", () => {
          map.setZoom(14);
          map.panTo(marker.position);
          this.selectShop(shop.name, shop.address, shop.position, i);
          this.showCarousel = true;
        });
        return marker;
      });
      this.markers = markers;
    },

    geolocationInit() {
      let that = this;
      const map = this.map;
      const google = this.google;
      // Create the DIV to hold the control and call the constructor passing in this DIV
      const geolocationDiv = document.createElement("div");
      const geolocationControl = new GeolocationControl(geolocationDiv, map);
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(geolocationDiv);

      function GeolocationControl(controlDiv, map) {
        // Set CSS for the control button
        var controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#444";
        controlUI.style.borderStyle = "solid";
        controlUI.style.borderWidth = "1px";
        controlUI.style.borderColor = "white";
        controlUI.style.height = "28px";
        controlUI.style.margin = "10px";
        controlUI.style.marginTop = "15px";
        controlUI.style.cursor = "pointer";
        controlUI.style.textAlign = "center";
        controlUI.title = "Click to center map on your location";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control text
        var controlText = document.createElement("div");
        controlText.style.fontFamily = "Arial,sans-serif";
        controlText.style.fontSize = "10px";
        controlText.style.color = "white";
        controlText.style.paddingLeft = "10px";
        controlText.style.paddingRight = "10px";
        controlText.style.marginTop = "8px";
        controlText.innerHTML = "Center map on your location";
        controlUI.appendChild(controlText);

        // Setup the click event listeners to geolocate user
        google.maps.event.addDomListener(controlUI, "click", that.geolocate);
      }
    },

    geolocate() {
      const map = this.map;
      const google = this.google;
      if (navigator.geolocation) {
        //delete old geolocation marker
        if (this.geolocMarker.length !== 0) {
          console.log(this.geolocMarker);
          this.geolocMarker[0].setMap(null);
          this.geolocMarker = [];
        }
        navigator.geolocation.getCurrentPosition(position => {
          const actualPosition = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          // Create a marker and center map on user location
          // const icon = require("../assets/yourPosition.png");
          const icon = 'https://www.google.com/mapfiles/marker_orange.png';
          const marker = new google.maps.Marker({
            icon: icon,
            position: actualPosition,
            animation: google.maps.Animation.DROP,
            map: map
          });
          map.setZoom(14);
          map.setCenter(actualPosition);
          marker.addListener("click", function() {
            map.setZoom(14);
            map.panTo(actualPosition);
          });
          this.geolocMarker.push(marker);
        });
      }
    }
  },

  async mounted() {
    const google = await gmapsInit();
    // const geocoder = new google.maps.Geocoder();
    const mapOptions = {
      center: new google.maps.LatLng(48.8534, 2.3488),
      disableDefaultUI: true,
      zoom: 11.5
    };
    const map = new google.maps.Map(
      document.getElementById("renderMap"),
      mapOptions
    );

    this.google = google;
    this.map = map;
    this.geolocationInit();
    this.getShopsMarkers();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

#mapComponent {
  position: relative;
}

#renderMap {
  width: 100vw;
  height: 100vh;
}

.carouselMap {
  background-color: white;
  position: absolute;
  bottom: 0;
  height: 200px;
  width: 100vw;
}

.shopBorder {
  border: 2px solid red;
}

.sizing {
  width: 70%;
}

</style>


