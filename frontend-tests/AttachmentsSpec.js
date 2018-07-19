import Attachments from '../dev/components/vue-attachments/Attachments.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The Attachment component's", () => {
    let wrapper;
    const exampleAttachments = [
        {
            attachment: "TestBlock_TextFile.txt",
            name: "TestBlock_TextFile.txt",
            block: "TestBlock",
            presented_name: "A very technical/unreadable text123file",
            size: "1234",
            version: "1",
        },
        {
            attachment: "TestBlock_ImageFile.png",
            name: "TestBlock_ImageFile.png",
            block: "TestBlock",
            presented_name: "A beautiful image",
            size: "2345",
            version: "2",
        },
        {
            attachment: "TestBlock_somefile",
            name: "TestBlock_somefile",
            block: "TestBlock",
            presented_name: "A generic file",
            size: "5",
            version: "3",
        },
    ];
    const options = {
        propsData: {
            web: 'TestWeb',
            topic: 'TestTopic',
            block: 'TestBlock',
            attachments: exampleAttachments,
            attachmentNameFilter: '[()]',
        }
    };
    const uploadId = 'websanova-upload-vueAttachmentsTestWeb.TestTopic#TestBlock';
    const uploadSelector = '#' + uploadId.replace(/([.#])/g, '\\$1');
    const optionsClone = () => JSON.parse(JSON.stringify(options));
    beforeEach(() => {
        wrapper = TestCase.mount(Attachments, options);
    });

    describe("file tiles'", () => {
        describe("label", () => {
            it("should insert 'zero width spaces' at special chars", async () => {
                let text = wrapper.find('[attachment="TestBlock_TextFile.txt"] .attachment-label:not(.upload-label)').text();
                expect(text).toBe(['A', ' ', 'very', ' ', 'technical', '/', 'unreadable', ' ', 'text', '123', 'file'].join('\u200B'));
            });
        });
        it("contains a preview for images", () => {
            expect(wrapper.contains('[attachment="TestBlock_ImageFile.png"] .attachment-tile img')).toBe(true);
        });
        it("contains no preview for misc files", () => {
            expect(wrapper.contains('[attachment="TestBlock_TextFile.txt"] .attachment-tile img')).toBe(false);
        });
        it("has an icon for specific files (png)", () => {
            expect(wrapper.contains('[attachment="TestBlock_ImageFile.png"] .thumbnail i.fa-file-image')).toBe(true);
        });
        it("has an icon for misc files", () => {
            expect(wrapper.contains('[attachment="TestBlock_somefile"] .thumbnail i.fa-file')).toBe(true);
        });
    });
    describe("upload tile", () => {
        it("is available by default", () => {
            expect(wrapper.contains('.upload-box')).toBe(true);
        });
        it("can be deactivated", () => {
            let myOptions = optionsClone();
            myOptions.propsData.readonly = true;
            wrapper = TestCase.mount(Attachments, myOptions);
            expect(wrapper.contains('.upload-box')).toBe(false);
        });
    });
    it("can be initialized with a JSON-string", () => {
        let myOptions = {
            propsData: {
                attachmentsJson: JSON.stringify(exampleAttachments),
            },
        };
        wrapper = TestCase.mount(Attachments, myOptions);
        expect(wrapper.contains('[attachment="TestBlock_ImageFile.png"]')).toBe(true);
    });
    describe("upload component", () => {
        it("uploads with the proper parameters", async () => {
            spyOn(wrapper.vm, '$getStrikeOneToken').and.returnValue(Promise.resolve());

            let postSpy = spyOn(wrapper.vm, 'post').and.callFake((url, body) => {
                expect(body.get('filename')).toBe('TestBlock_(Text)File.txt');
                expect(body.get('presented_name')).toBe('(Text)File.txt');
                return Promise.resolve();
            });

            let fileUploadFormData = new FormData();
            let file = new File(["some file"], '(Text)File.txt', { // XXX does not work in edge or IE
                type: 'text/plain',
            });
            fileUploadFormData.append('filepath', file);

            await wrapper.vm.uploadHttp({body: fileUploadFormData});
            expect(postSpy).toHaveBeenCalled();
        });
        it("filters the attachment list", async () => {
            expect(wrapper.vm.internalAttachments.filter(item => item.name === 'TestBlock_TextFile.txt').length).toBe(1);
            wrapper.vm.filterQueueFromAttachments([{name: '(Text)File.txt'}]);
            expect(wrapper.vm.internalAttachments.filter(item => item.name === 'TestBlock_TextFile.txt').length).toBe(0);
        });
        it("recognises a successful upload", () => {
            wrapper.vm.uploadOnSuccess({bodyText: 'OK: TestBlock_NewFile.png uploaded'}, {name: '(New)File.png'});
            let filtered = wrapper.vm.internalAttachments.filter(item => item.name === 'TestBlock_NewFile.png' && item.presented_name === '(New)File.png');
            expect(filtered.length).toBe(1);
        });
        it("recognises a renamed upload", () => {
            wrapper.vm.uploadOnSuccess({bodyText: 'OK: OopsException(attention/upload_name_changed web=>TestWeb topic=>TestTopic params=>[TestBlock_21316.htm,TestBlock_21316.htm.txt])'}, {name: '21316.htm'});
            window.console.log(JSON.stringify(wrapper.vm.internalAttachments));
            let filtered = wrapper.vm.internalAttachments.filter(item => item.name === 'TestBlock_21316.htm.txt' && item.presented_name === '21316.htm');
            expect(filtered.length).toBe(1);
        });
    });
});

