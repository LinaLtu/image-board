Vue.component('single-image', {
    props: ['id'],
    data: function() {
        return {
            image: {
                title: '',
                description: '',
                username: '',
                id: null
            },
            error: false,
            comment: '',
            comments: [],
            commentInfo: {},
            selectedImage: null
        };
    },
    methods: {
        exit: function() {
            this.$emit('done');
        },
        handleCommentSubmit: function(e) {
            let self = this;
            this.commentInfo.username;
            this.commentInfo.description;
            axios
                .post('/comments', {
                    comments: this.commentInfo.description,
                    username: this.commentInfo.username,
                    image_id: this.id
                })
                .then(function(resp) {
                    self.comments.unshift(resp.data.results);
                });
        }
    },
    template: '#big-image',
    mounted: function() {
        if (isNaN(this.id)) {
            return;
        }

        var self = this;

        axios.get('/images/' + this.id).then(function(resp) {
            if (!resp.data.image) {
                self.error = true;
            }
            if (!resp.data.success) {
                self.$emit('done');
            } else {
                self.image = resp.data.image;
            }

            axios.get('/comments/' + self.id).then(function(resp) {
                self.comments = resp.data.comments;
            });
        });
    },
    watch: {
        id: function() {
            if (isNaN(this.id)) {
                return;
            }
            var self = this;
            axios.get('/images/' + this.id).then(function(resp) {
                if (!resp.data.success) {
                    self.$emit('done');
                } else {
                    self.image = resp.data.image;

                    axios.get('/comments/' + self.id).then(function(resp) {
                        self.comments = resp.data.comments;
                    });
                }
            });
        }
    }
});

new Vue({
    el: '#main',
    data: {
        images: [],
        selectedImage: location.hash.slice(1) || null,
        formInfo: {
            title: '',
            description: '',
            username: '',
            file: void 0
        }
    },
    methods: {
        handleChange: function(e) {
            this.formInfo.file = e.target.files[0];
        },

        handleSubmit: function(e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', this.formInfo.title);
            formData.append('description', this.formInfo.description);
            formData.append('username', this.formInfo.username);
            formData.append('file', this.formInfo.file);

            axios.post('/upload', formData).then(results => {
                this.formInfo.title = '';
                this.formInfo.description = '';
                this.formInfo.username = '';
                this.formInfo.file = '';

                this.images.unshift(results.data);
            });
        },
        hideImage: function() {
            this.selectedImage = null;
            location.hash = '';
        }
    },
    mounted: function() {
        var app = this;
        window.offset = 0;

        axios.get('/imagesList/0').then(function(results) {
            app.images = results.data.images;
        });

        window.addEventListener('hashchange', function() {
            if (!(parseInt(location.hash.slice(1)) == location.hash.slice(1))) {
                location.hash = '';
                app.selectedImage = null;
            } else {
                app.selectedImage = location.hash.slice(1);
            }
        });
    }
});
