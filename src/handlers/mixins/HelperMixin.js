import { makeURL } from "@/utils/commonFunctions";

export default {
    data: () => ({}),
    mounted() { },
    methods: {
        // =================== Common ============================================================
        endpoint(path, query = "") {
            let x = makeURL(path);
            x.search = new URLSearchParams(query);
            return x;
        },
        genGetParams() {
            return { method: "GET", mode: "cors", cache: "no-cache", credentials: "include" };
        },
        genPostParams(body) {
            return {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
                body: typeof body !== "string" ? JSON.stringify(body) : body
            };
        },
        genPostParamsJSON(body) {
            let x = this.genPostParams(body);
            x.headers = { Accept: "application/json", "Content-Type": "application/json" };
            return x;
        },

    },
    computed: {}
};
