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
            console.log("From axios ", this.id);
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
        // console.log("Mounted ran");
        if (isNaN(this.id)) {
            // console.log("Log from the if");
            return;
        }
        console.log(this);
        var self = this;
        // console.log(self.id);
        axios.get("/images/" + this.id).then(function(resp) {
            if (!resp.data.image) {
                self.error = true;
            }
            if (!resp.data.success) {
                self.$emit("done");
            } else {
                self.image = resp.data.image;
                console.log(self);
            }

            axios.get("/comments/" + self.id).then(function(resp) {
                console.log(resp);
                self.comments = resp.data.comments;
            });
        });
    },
    watch: {
        id: function() {
            // console.log("Watch ", this);
            if (isNaN(this.id)) {
                return;
            }
            var self = this;
            axios.get("/images/" + this.id).then(function(resp) {
                if (!resp.data.success) {
                    self.$emit("done");
                } else {
                    self.image = resp.data.image;
                    console.log(self);
                    axios.get("/comments/" + self.id).then(function(resp) {
                        self.comments = resp.data.comments;
                    });
                }
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

        handleScroll: function(e) {
            // $(window).scroll(function() {
            //     if (
            //         $(window).scrollTop() + $(window).height() ==
            //         $(document).height()
            //     ) {
            //         alert("bottom!");
            //     }
            // });

            //if it's not scrolled to the bottom, then {return}

            console.log("Running scroll"); //running as soon as the page uploads
            //scrollTop -> run handleScroll
            //get the correct number of images being displayed (this.images.length = offset)
            //then use the offset number
            var body = document.body,
                html = document.documentElement;

            var documentHeight = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );

            var scrollBottom = html.clientHeight + window.scrollY;

            console.log(scrollBottom);

            //This is where we have problems - we should not make another request if the current one is still running
            if (documentHeight == scrollBottom) {
                alert("Bottom!!");

                console.log(this.images.length);
                // var offset = window.offset + 6;
                var app = this;

                //This event listener gets removed and we do not check if scroll occurs again
                window.removeEventListener("scroll", this.handleScroll);

                axios.get("/imagesList/" + offset).then(function(results) {
                    window.requestOpen = true;

                    var newData = app.images.concat(results.data.images);
                    app.images = newData;
                    var resultsLength = results.data.images.length;

                    console.log("Total results: ", results);
                });
            }
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
        window.offset = 0;

        axios.get("/imagesList/0").then(function(results) {
            app.images = results.data.images;
        });

        window.addEventListener("hashchange", function() {
            // console.log(typeof parseInt(location.hash.slice(1)));
            if (!(parseInt(location.hash.slice(1)) == location.hash.slice(1))) {
                console.log("We are heeeeeere");
                location.hash = "";
                app.selectedImage = null;
            } else {
                app.selectedImage = location.hash.slice(1);
            }
        });
    },
    created: function() {
        window.addEventListener("scroll", this.handleScroll);
    },
    destroyed: function() {
        window.removeEventListener("scroll", this.handleScroll);
    }
});
