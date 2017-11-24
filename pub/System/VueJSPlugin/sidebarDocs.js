Vue.onDocumentReady(function(){
	/*
		The sidebar can be defined as a child of any vue component
		that wants to use it. It does not matter where you define
		the component in the DOM. Methods of the sidebar can be accessed
		by specifying a ref on the component. The default slot
		of the sidebar will be used as the sidebar content.
		By default all the content area of the sidebar is used
		without any layout settings like padding, etc.
	*/
	new Vue({
		el: '#sidebarBareExample',
		template: "<div> \
			<button class='primary button' @click='openSidebar'>Barebone</button> \
			<sidebar ref='sidebar'> \
				<div> \
					<button class='alert button' @click='hideSidebar'>Close me!</button> \
				</div> \
			</sidebar> \
		</div>",
		methods: {
			openSidebar: function(){
				this.$refs.sidebar.show();
			},
			hideSidebar: function(){
				this.$refs.sidebar.hide();
			}
		}
	});

	/*
		The sidebar comes with a standard layout component which can be used
		to define separate header and content areas.
	*/
	new Vue({
		el: '#sidebarLayoutExample',
		template: "<div> \
			<button class='primary button' @click='openSidebar'>With layout</button> \
			<sidebar ref='sidebar'> \
				<sidebar-standard-layout> \
					<div slot='header'>I am in the header!</div> \
					<div slot='content'>I am in the content!</div> \
				</sidebar-standard-layout> \
			</sidebar> \
		</div>",
		methods: {
			openSidebar: function(){
				this.$refs.sidebar.show();
			}
		}
	});
	/*
		The sidebar can also be defined to have several tabs with different content
		areas. To do this just pass in an array of tab definitions via the tabs
		property as in the following example. Note that this example does not
		define any content for the tabs, so by default the tabs will just show
		the corresponding tab tooltips as content.
	*/
	new Vue({
		el: '#sidebarTabExample',
		template: "<div> \
			<button class='primary button' @click='openSidebar'>With tabs</button> \
			<sidebar :tabs='tabs' ref='sidebar'/> \
		</div>",
		data: function(){
			return {
				tabs: [{
					tooltip: "This is tab 0 tooltip",
					icon: "fa-trash"
				}, {
					tooltip: "This is tab 1 tooltip",
					icon: "fa-car"
				}]
			};
		},
		methods: {
			openSidebar: function(){
				this.$refs.sidebar.show();
			}
		}
	});

	/*
		Content for tabs is defined via slots.
		Every defined tab has a corresponding slot to define its contents.
		The slot name is derived from the tabs array index. So to define
		content for the first defined tab you would use the slot with the
		name 'tab0'.
	*/
	new Vue({
		el: '#sidebarTab2Example',
		template: "<div> \
			<button class='primary button' @click='openSidebar'>With tabs and content</button> \
			<sidebar :tabs='tabs' ref='sidebar'> \
				<div slot='tab0'>Here is some content for tab 0</div> \
				<div slot='tab1'>Here is some content for tab 1</div> \
			</sidebar> \
		</div>",
		data: function(){
			return {
				tabs: [{
					tooltip: "This is tab 0",
					icon: "fa-trash"
				}, {
					tooltip: "This is tab 1",
					icon: "fa-car"
				}]
			};
		},
		methods: {
			openSidebar: function(){
				this.$refs.sidebar.show();
			}
		}
	});

	/*
		The sidebar also has a mechanism to show modals.
		Modals are not defined in templates. Instead modals are
		globally defined vue components which need to accept a 'config'
		property. When you call sidebar.showModal it will instantiate such
		a component and pass the provided contentConfig to the modal component.
		By default it will create the confirm-modal component which can display
		a header, desciption and accept and abort buttons. If you want to
		instantiate another modal component you have to additionally provide
		a type property when calling showModal (see the commented out property below).
		If you want to create your own
		modal component have a look at ConfirmModal.vue for reference.
	*/
	new Vue({
		el: '#sidebarModalExample',
		template: "<div> \
			<button class='primary button' @click='openSidebar'>Modal</button> \
			<sidebar ref='sidebar'> \
				<button class='primary button' @click='openModal'>Open standard modal</button> \
			</sidebar> \
		</div>",
		methods: {
			openSidebar: function(){
				this.$refs.sidebar.show();
			},
			openModal: function() {
				this.$refs.sidebar.showModal({
					// type: 'my-custom-modal',
					contentConfig: {
						header: "This is the standard confirm modal",
						description: [
						"This is the description",
						"You can either provide a single string or an array",
						"Every array element will be display in a new paragraph."],
						acceptButton: {
							name: "OK!",
							onClick: function(){
								alert("Everything is ok!")
							}
						},
						abortButton: {
							name: "Abort!",
							onClick: function() {
								alert("Abort! Abort! Abort!");
							}
						}
					}
				});
			}
		}
	});
});