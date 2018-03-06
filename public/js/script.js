new Vue({
    el: "#main", //where our app will load
    data: {
        images: [],
        formInfo: {
            title: "",
            description: "",
            username: "",
            file: void 0
        }
    },
    methods: {
        handleChange: function(e) {
            this.formInfo.file = e.target.files[0];
            // console.log("Handle change ran", this);
        },
        handleSubmit: function(e) {
            e.preventDefault();
            const formData = new FormData(); //this is how we send an image
            formData.append("title", this.formInfo.title);
            formData.append("description", this.formInfo.description);
            formData.append("username", this.formInfo.username);
            formData.append("file", this.formInfo.file);

            axios.post("/upload", formData).then(results => {
                console.log("Results from Axios", results);
                this.formInfo.title = "";
                this.formInfo.description = "";
                this.formInfo.username = "";
                this.formInfo.file = "";

                // console.log(results.data.image);
                this.images.unshift(results.data);

                console.log("Images:", this.images);
                // images.unshift(results.data.file);

                // res
                //     .json({
                //         title: results.data.title,
                //         description: results.data.description,
                //         username: results.data.username,
                //         file: results.data.images
                //     })
                // .then(file => images.unshift(file));
                // console.log(results.title);
                //res.json back the info about the new image
                //image data will be un results.data.images
                //then unshift (add to the beginning of an array) the next image into this.images
            });
        }
    },
    mounted: function() {
        //mounted is always a function (life-cycle method - it runs when it loads)
        var app = this;
        axios.get("/images").then(function(results) {
            app.images = results.data.images;
        });
    }
});
