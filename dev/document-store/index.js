const module = {
    namespaced: true,
    state: {
        web: '',
        topic: '',
        creationDate: '',
        creator: '',
        lastEditor: undefined,
        lastEditDate: undefined,
        revision: undefined,
        text: '',
        typeData: {
        },
    },
    mutations: {
        setDocument(state, {web, topic, revision, lastEditor, lastEditDate, typeData, creationDate, creator}) {
            state.web = web;
            state.topic = topic;
            state.creationDate = creationDate;
            state.creator = creator;
            state.revision = revision;
            state.lastEditor = lastEditor;
            state.lastEditDate = lastEditDate;
            state.typeData = typeData;
        },
        updateDocument(state, newContent) {
            Object.assign(state, newContent);
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
