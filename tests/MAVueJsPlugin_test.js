import MAVueJsPlugin from '../dev/MAVueJsPlugin.js'

describe("The MAVueJsPlugin component", () => {
  describe("html decode funtion", () => {
    it("should decode html decoded objects", () => {
      var htmlEncodedString = "&lt;body&gt;K&auml;se&lt;/body&gt;";
      var htmlString = MAVueJsPlugin.htmlDecode(htmlEncodedString);
      expect(htmlString).toEqual("<body>Käse</body>");
    });
  });
});

