new Vue({
    el: "#main",
    data: {
        heading: "Lastest Images",
        images: [],
        titles: []
    },
    mounted: function() {
        var app = this;
        axios.get("/cities").then(function(resp) {
            app.cities = resp.data.cities;
        });
    }
});
