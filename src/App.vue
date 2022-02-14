<template>
  <div id="app">
    <div id="layout">
      <div id="header">Local-Tile Persistent-Cache</div>
      <div id="map"></div>
      <div id="explain-text-block">
        <p>
        Watch the console for info. <code>Shift + Ctrl + J</code> 
        <p>
          Every time you see cache hit it means we've saved one unecessary online tile-request (to for example: cartoserver).
        </p>
        <p>
        By checking if we've got that pouch-id
        <ul>
          <li>
        and the id's are cleverly those same whole hyperlinks for each tile.
          </li>
            <li>
              eg. 
              <code>
              _id="http://cs.stratumfive.com/chart/2400,1000/epsg3857:-12000000,5000000,12000000,-5000000/png?layers=bg:fff;latlongrid;trs2:2021102617::::"
              </code>
          </li>
        </ul>
        </p>
        <p>
        When it says cache missed, that just means it had to fetch and cache that file. Over-time you get more hits than misses.
        If you say zoom out and to the same town a couple of times, due to sensible debounce/throttling, you probably save some tiles but not all, on your first zoom in. Every time, you're sort of colouring-in the local storage of tiles. So the susequent zooms just get snappier.
        </p>
        <p>
  Watch the Application tab in dev-tools:
        </p>
        <p>
            You see the number of files building up by clicking the button below.
        </p>
        <!-- </p> -->
      </div>
    <button @click="getDocs">Log from subselection of allDocs</button>
  </div>
</div>
  
</template>

<script>
import Vue from "vue";
import PouchDB from "pouchdb-browser";
import PouchFind from 'pouchdb-find' // https://pouchdb.com/guides/mango-queries.html

PouchDB.plugin(PouchFind);

import init from "@/init";
import { joinPouchToLeaflet } from "@/utils/L.TileLayer.PouchDBCached.js";


export default Vue.extend({
  data() {
    return {
      text: "Hello world",
      L: null,
      pouchTiles: null,
      response: null,
    };
  },
  methods: {
    async getDocs() {
      // Testing different ways to access info from pouch
      const allDocs = await this.pouchTiles.allDocs()
      const localTilesCount = allDocs.rows.length
      console.log("dvdb - getDocs - localTilesCount", localTilesCount)
      const firstHundred = await this.pouchTiles.allDocs({
        include_docs: true,
        binary: true,
        limit: 100,
        conflicts: true,
      })
      console.log("dvdb - getDocs - firstHundred", firstHundred)

      const queryTerrainTilesOnly = await this.pouchTiles.query({
        map: function(doc, emit) {
          if (doc._id.includes('https://stamen-tiles-a.a.ssl')) {
            emit(doc, 1);
          }
        }  
      })
      console.log("Even if all tiles are stored flat regardless of endpoint used,")
      console.log("we can filter queries based on the main link, eg 'https://stamen-tiles-a.a.ssl.fastly.net/'")
      console.log("dvdb - getDocs - queryTerrainTilesOnly", queryTerrainTilesOnly)
      
       
       /**
        *    this.pouchTiles.createIndex({
        index: {fields: ['_id', "timestamp"]},
        ddoc: "timestamp"
    }).then( async(response) => {
      console.log("dvdb - getDocs - response", response)
      const valToReturn = await this.pouchTiles.find({
          // use_index: 'timestamp',
        selector: {
          // Don't know what between these strings really means,
          // In other structures it makes sense to think in endpoints or file-paths.
          // Id's like this create a deeply-nested data-structure from flat-stored documents. 
          timestamp: {
            $gt: 1644742199836,
            $lt: 1644742201127
          },
          _id: {
            $gt: 0
          }
        },
        fields: ['timestamp', "_id"],
        // sort: ['timestamp']
      })
      console.log("dvdb - getDocs - valToReturn", valToReturn)
    })
        *  */ 
    
  }
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
        this.response = response
      }
    );

      console.log("dvdb - mounted - creatIndex", this.pouchTiles)
    // use MongoDB query syntax
    this.pouchTiles.createIndex({
      index: {fields: ['id']}
    });
    console.log("dvdb - mounted - creatIndex after add", this.pouchTiles) 
  },
  
})



  

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

#header {
  font-size: large;
}

#layout {
  margin: auto;
  max-width: 900px;
}

#explain-text-block {
  margin: 0 50px;
}

p {
  text-align: left;
}
</style>
