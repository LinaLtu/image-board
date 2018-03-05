new Vue({
    el: "#main", //where our app will load
    data: {
        images: []
    },
    methods: {},
    mounted: function() {
        //mounted is always a function (life-cycle method - it runs when it loads)
        var app = this;
        // console.log("running mounted");
        axios.get("/images").then(function(results) {
            console.log("Results from getImages", results.data);
            app.images = results.data.images;
        });
    }
});
