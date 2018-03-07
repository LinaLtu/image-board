Vue.component("single-image", {
    props: ["id"],
    data: function() {
        return {
            image: {
                title: "",
                description: "",
                username: "",
                id: null
            },
            comments: [],
            commentInfo: {},
            selectedImage: null
        };
    },
    methods: {
        exit: function() {
            this.$emit("done");
        },
        handleCommentSubmit: function(e) {
            e.preventDefault();
            this.commentInfo.username;
            this.commentInfo.description;
            console.log("Comment Info: ", this.commentInfo.username, this.commentInfo.description);
            axios.post("/comments", {
                comments: this.commentInfo.description,
                username: this.commentInfo.username,
                image_id : this.id
            });
            // console.log("This from handleCommentsSubmit", this);

            // e.preventDefault();
            // const formData = new FormData(); //this is how we send an image
            // formData.append("title", this.formInfo.title);
            // formData.append("description", this.formInfo.description);
            // formData.append("username", this.formInfo.username);
            // formData.append("file", this.formInfo.file);
            //
            // axios.post("/upload", formData).then(results => {
            //     // console.log("Results from Axios", results);
            //     this.formInfo.title = "";
            //     this.formInfo.description = "";
            //     this.formInfo.username = "";
            //     this.formInfo.file = "";
            //
            //     // console.log(results.data.image);
            //     this.images.unshift(results.data);
            //
            //     console.log("Images:", this.images);
            //res.json back the info about the new image
            //image data will be un results.data.images
            //then unshift (add to the beginning of an array) the next image into this.images
            // });
        }
    },
    template: "#big-image",
    mounted: function(){
        var self = this;
        axios.get('/images/' + this.id).then(function(resp){
            self.image = resp.data.image;
            console.log(self);
        });
    }
});


new Vue({
    el: "#main", //where our app will load
    data: {
        images: [],
        selectedImage: null,
        formInfo: {
            title: "",
            description: "",
            username: "",
            file: void 0
        }
    },
    methods: {
        handleChange: function(e) {
            this.formInfo.file = e.target.files[0]; //???
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
                // console.log("Results from Axios", results);
                this.formInfo.title = "";
                this.formInfo.description = "";
                this.formInfo.username = "";
                this.formInfo.file = "";

                // console.log(results.data.image);
                this.images.unshift(results.data);

                console.log("Images:", this.images);

                //res.json back the info about the new image
                //image data will be un results.data.images
                //then unshift (add to the beginning of an array) the next image into this.images
            });
        },
        hideImage: function(){
            this.selectedImage = null;
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

// axios.post('/comment', {
//     username:
// })
