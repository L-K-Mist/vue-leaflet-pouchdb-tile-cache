<template>
  <div id="app">
    <div id="map"></div>
    <div id="explain">
      <p>
      Watch the console for info. <code>Shift + Ctrl + J</code> 
      Every time you see chache hit it means we've saved one online tile-request (to for example: cartoserver).
      By checking if we've got that pouch-id
          and the id's are cleverly those same whole hyperlinks for each tile.
          eg. "http://cs.stratumfive.com/chart/2400,1000/epsg3857:-12000000,5000000,12000000,-5000000/png?layers=bg:fff;latlongrid;trs2:2021102617::::"
      When it says cache missed, that just means it had to fetch and cache that file.
      Over-time you get more hits than misses. 
      Watch the Application tab in dev-tools:
          You see the number of files building up (you have to click the refresh-button)
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import PouchDB from "pouchdb-browser";

import init from "@/init";
import { joinPouchToLeaflet } from "@/utils/L.TileLayer.PouchDBCached.js";


export default Vue.extend({
  data() {
    return {
      text: "Hello world",
      L: null,
      pouchTiles: null,
    };
  },
  mounted() {
    this.L = init("map");
    console.log("dvdb - mounted - this.L", this.L);
    this.pouchTiles = new PouchDB("offline-tiles", {
      revs_limit: 3,
      deterministic_revs: true,
    })
    console.log("dvdb - mounted - this.pouchTiles", this.pouchTiles);
    this.pouchTiles.info().then(function (resp) {
      console.log("dvdb - pouchTiles info", resp);
      //resp will contain disk_size
    });
    joinPouchToLeaflet(this.L, this.pouchTiles);

    // use allDocs to batch fetch:
    this.pouchTiles.allDocs(
      {
        include_docs: true,
      },
      (response) => {
        console.log("dvdb - mounted - response", response);
      }
    );
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#map {
  width: 100%;
  height: 100%;
  min-width: 400px;
  min-height: 350px;
}
</style>
