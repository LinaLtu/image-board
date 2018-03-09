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
            error: false,
            comment: "",
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
            // e.preventDefault();
            let self = this;
            this.commentInfo.username;
            this.commentInfo.description;
            console.log(
                "Comment Info: ",
                this.commentInfo.username,
                this.commentInfo.description
            );
            axios
                .post("/comments", {
                    comments: this.commentInfo.description,
                    username: this.commentInfo.username,
                    image_id: this.id
                })
                .then(function(resp) {
                    console.log("From axios ", this.commentInfo.description);
                    self.comments.unshift(resp.data.results);
                });
        }
    },
    template: "#big-image",
    mounted: function() {
        if (isNaN(this.id)) {
            console.log("Log from the if");
            return;
        }

        var self = this;
        // console.log(self.id);
        axios.get("/images/" + this.id).then(function(resp) {
            if (!resp.data.image) {
                self.error = true;
            }
            self.image = resp.data.image;
            console.log(self);
        });
        axios.get("/comments/" + this.id).then(function(resp) {
            self.comments = resp.data.comments;
        });
    },
    watch: {
        id: function() {
            console.log("Watch ", this.id);
            if (isNaN(this.id)) {
                return;
            }
            var self = this;
            axios.get("/images/" + this.id).then(function(resp) {
                self.image = resp.data.image;
                console.log(self);
            });
        }
    }
});

new Vue({
    el: "#main", //where our app will load
    data: {
        images: [],
        selectedImage: location.hash.slice(1) || null,
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

                this.images.unshift(results.data);

                console.log("Images:", this.images);
            });
        },
        hideImage: function() {
            this.selectedImage = null;
            location.hash = "";
        }
    },
    mounted: function() {
        //mounted is always a function (life-cycle method - it runs when it loads)
        var app = this;
        axios.get("/images").then(function(results) {
            app.images = results.data.images;
        });
        window.addEventListener("hashchange", function() {
            console.log(app.selectedImage);
            app.selectedImage = location.hash.slice(1);
            console.log("Hash changed ", location.hash.slice(1));
        });
    }
});
