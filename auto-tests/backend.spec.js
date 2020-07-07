var sutBackendUrl = "http://localhost:8080/";
var axios = require("axios").default;
var uuidGen = require("uuid");
axios.defaults.baseURL = sutBackendUrl;

describe("Testing application behaviour", () => {
  it("should return `Succesfully! Result is 16` on success", async () => {
    var traceId = uuidGen.v1();
    expect(await callApi(traceId)).toBe("Succesfully! Result is 16");
  });

  it("should call external service with `{value: 4}` body", async () => {
    var traceId = uuidGen.v1();
    await callApi(traceId);
    var externalSystemRequest = (await getRequestFromStub(traceId))[0];
    expect(externalSystemRequest.body.json).toBe(`{"value":4}`);
  });

  it("should return Fail with reason on error", async () => {
    var traceId = `FAIL-${uuidGen.v1()}`;
    expect(await callApi(traceId)).toEqual(
      expect.stringContaining("Failed! cause:")
    );
  });
});

async function callApi(traceId) {
  return await axios
    .get("api/call", { headers: { "x-trace-id": traceId } })
    .then((v) => {
      return v.data;
    })
    .catch((r) => {
      return r.response.data;
    });
}

async function getRequestFromStub(traceId) {
  return await axios
    .put(
      "http://localhost:8082/mockserver/retrieve?type=REQUESTS&format=JSON",
      {
        path: "/externalapi/square",
        method: "POST",
        headers: {
          "x-trace-id": [`${traceId}`],
        },
      }
    )
    .then((v) => {
      return v.data;
    })
    .catch((v) => {
      return v;
    });
}
