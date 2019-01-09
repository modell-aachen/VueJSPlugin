const module = {
    namespaced: true,
    state: {
        web: '',
        topic: '',
        lastEditor: undefined,
        lastEditDate: undefined,
        revision: undefined,
        text: '',
        typeData: {
        },
    },
    mutations: {
        setDocument(state, {web, topic, revision, lastEditor, lastEditDate, typeData}) {
            state.web = web;
            state.topic = topic;
            state.revision = revision;
            state.lastEditor = lastEditor;
            state.lastEditDate = lastEditDate;
            state.typeData = typeData;
        },
    },
    getters: {
        title(state) {
            if(state.typeData && state.typeData.TopicTitle && state.typeData.TopicTitle.length) {
                return state.typeData.TopicTitle;
            } else {
                return state.topic;
            }
        },
    },
};

export {
    module,
};
