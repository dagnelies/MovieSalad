
var page = 0; // an evil global variable ;)
var ractive = new Ractive({
	el: 'body',
	template: '#template',
	data: {
		movies: [],
		view: 'list',
		type: 'now_playing'
	},
	computed: {
		url: function() { // this is automatically recomputed when related data changes
			var title_filter = this.get('title_filter')
			if( title_filter )
				return 'https://api.themoviedb.org/3/search/movie?api_key=2498a34e67fe4a6a0a209316d830d942&query=' + window.encodeURIComponent(title_filter);
			else
				return 'https://api.themoviedb.org/3/movie/' + this.get('type') + '?api_key=2498a34e67fe4a6a0a209316d830d942'
		}
	},
	observe: {
		url: function(value) { // this gets called when a variable changes, including a computed one
			this.set('movies', [])
			page = 0; // we can also reference outside stuff
			this.loadMore();
		}
	},
	loadMore: function() {
		page++; // this is used for infinite scrolling
		var url = this.get('url');
		console.log('Loading ' + url + '&page=' + page)
		var self = this; // the usual trick
		$.ajax({
			url: url + '&page=' + page,
			success: function(data) {
				for(var i in data.results)
					self.push('movies', data.results[i])
			}
		})
	}
});

$(window).scroll(function(){
	if($(window).scrollTop() == $(document).height() - $(window).height()){
		ractive.loadMore();
	}
});

function showDetails(id) {
	ractive.set('details', null);
	ractive.set('view', 'overview')
	$.ajax({
		url: 'https://api.themoviedb.org/3/movie/' + id + '?api_key=2498a34e67fe4a6a0a209316d830d942&append_to_response=videos,similar,reviews,recommendations',
		success: function(data) {
			ractive.set('details', data)
		}
	})
}