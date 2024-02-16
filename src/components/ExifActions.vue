<template>
  <section>
    <v-row v-for="action in actions" :key="action.id" align="center" class="actions">
      <v-col cols="auto">
        <v-icon :color="actions.statusColor || 'grey'">{{ action.icon }}</v-icon>
      </v-col>
      <v-col>
        <v-select v-model="action.group" :items="groupOptions" :label="$t('exifActions.groupSelect')" @change="action.key = null"></v-select>
      </v-col>
      <v-col>
        <v-autocomplete
          v-model="action.key"
          :items="groupOptionOptions[action.group]"
          :disabled="!action.group"
          :label="$t('exifActions.keySelect')"
          return-object
          @change="(action.value = null), evaluate(action)"
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-text-field
          v-model="action.value"
          :label="$t('exifActions.value')"
          :type="action.key ? action.key.inputType : 'text'"
          :placeholder="$t('exifActions.inputType.' + (action.key ? action.key.inputType : 'text'))"
          :disabled="action.type === 'remove'"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="status">
        <span v-if="!action.group" class="err"><v-icon small>mdi-close</v-icon>{{ $t("exifActions.status.noGroup") }}</span>
        <span v-else-if="!action.key" class="err"><v-icon small>mdi-close</v-icon>{{ $t("exifActions.status.noKey") }}</span>
        <span v-else-if="!action.value && action.type !== 'remove'" class="warn">
          <v-icon small>mdi-help-circle-outline</v-icon>{{ $t("exifActions.status.noValue") }}
        </span>
        <span v-else class="suc"><v-icon>mdi-check</v-icon>{{ $t("exifActions.status.ok") }}</span>
      </v-col>
      <v-col v-if="action.eval" cols="12" class="expectedResults">{{ $t("exifActions.eval", action.eval) }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-menu v-model="addActionMenu" top :close-on-content-click="false" min-width="300px" max-height="80vh">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon>{{ $t("exifActions.add") }}</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="actionType in actionTypes" :key="actionType" link @click="addAction(actionType)">
              {{ $t("exifActions.actionTypes." + actionType) }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import piexif from "piexifjs";
import Vue from "vue";
import { jsonClone, rId, scrollToElement } from "../utils/commonFunctions";
// NOTE: possible types of inputs: { "Ascii": 63, "Long": 63, "Short": 133, "Rational": 74, "Byte": 55, "Undefined": 37, "SRational": 30, "Float": 7 }
const TYPE_MAP = { Ascii: "text", Long: "number", Short: "number", Rational: "number", Byte: "text", Undefined: "text", SRational: "number", Float: "number" };
const ACTION_TYPES = ["add", "replace", "remove"];
const ACTION_ICONS = { add: "mdi-plus", replace: "mdi-refresh", remove: "mdi-minus" };
export default {
  name: "exif-actions",
  props: { images: { type: Array, required: true } },
  components: {},
  data: () => ({
    tags: piexif.TAGS,
    addActionMenu: false,
    actionTypes: ACTION_TYPES,
    actions: [],
    groupOptions: [],
    groupOptionOptions: {}
  }),
  watch: {
    "$i18n.locale"() {
      this.setup();
    },
    images() {
      this.actions.forEach(action => this.evaluate(action));
    }
  },
  mounted() {
    console.log("exifObj", this.exifObj);
    console.log("tags", this.tags);
    console.log("tagsLikeKeys", this.tagsLikeKeys);
    this.setup();
  },
  methods: {
    setup() {
      this.groupOptions = Object.keys(this.tags)
        .filter(groupKey => !["thumbnail", "Interop"].includes(groupKey))
        .map(groupKey => ({ value: groupKey, text: this.$t("exif.groupName." + groupKey) }))
        .sort((a, b) => a.value.localeCompare(b.value));
      this.groupOptionOptions = {};
      this.groupOptions.forEach(groupOption => {
        Vue.set(
          this.groupOptionOptions,
          groupOption.value,
          Object.keys(this.tags[groupOption.value]).map(valKey => ({
            value: valKey,
            text: this.tags[groupOption.value][valKey].name,
            inputType: TYPE_MAP[this.tags[groupOption.value][valKey].type]
          }))
        );
      });
    },
    reset() {
      this.actions = [];
    },
    addAction(actionType) {
      this.addActionMenu = false;
      this.actions.push({ id: rId(), type: actionType, icon: ACTION_ICONS[actionType], statusColor: null, group: null, key: null, value: null, eval: null });
    },
    evaluate(action) {
      if (!action.group || !action.key) return;
      let hasKey = 0;
      this.images.forEach(image => {
        if (image.exifObj[action.group] && image.exifObj[action.group][action.key.value]) hasKey++;
      });
      let willActUpon = action.type === "add" ? this.images.length - hasKey : hasKey;
      action.eval = { hasKey, outOf: this.images.length, willActUpon };
    },
    //
    //
    // --------------------
    //
    //
    removeValue(groupKey, valKey) {
      if (!groupKey || !valKey) return;
      Vue.delete(this.exifObj[groupKey], valKey);
    },
    exifObjToKeys(obj) {
      return Object.keys(obj)
        .filter(groupKey => !["thumbnail", "Interop"].includes(groupKey))
        .map(groupKey => ({
          key: groupKey,
          keys: Object.keys(obj[groupKey]).map(valKey => ({
            key: valKey,
            ...this.tags[groupKey][valKey],
            inputType: TYPE_MAP[this.tags[groupKey][valKey].type]
          }))
        }));
    },
    add(groupKey, val) {
      console.log(groupKey, val);
      this.addMenu = false;
      if (!this.exifObj[groupKey]) Vue.set(this.exifObj, groupKey, {});
      if (this.exifObj[groupKey][val.key]) scrollToElement(document.getElementById(`${groupKey}.${val.key}`));
      else {
        Vue.set(this.exifObj[groupKey], val.key, this.defaultForInputType(val.inputType));
        setTimeout(() => scrollToElement(document.getElementById(`${groupKey}.${val.key}`)), 128);
      }
    },
    defaultForInputType(inputType) {
      // with idea that sometime i'll handle arrays too...
      if (inputType === "number") return 0;
      if (inputType === "string") return "";
    }
  },
  computed: {
    tagsLikeKeys() {
      return this.exifObjToKeys(this.tags).sort((a, b) => a.key.localeCompare(b.key));
    },
    filteredTagsLikeKeys() {
      if (!this.tagSearch) return this.tagsLikeKeys;
      let rez = jsonClone(this.tagsLikeKeys.filter(group => group.keys.find(tag => tag.name.toLocaleLowerCase().includes(this.tagSearch.toLocaleLowerCase()))));
      rez.forEach(group => (group.keys = group.keys.filter(tag => tag.name.toLocaleLowerCase().includes(this.tagSearch.toLocaleLowerCase()))));
      return rez;
    }
  }
};
</script>

<style scoped lang="scss">
.expectedResults,
.status {
  color: grey;
  font-size: 12px;
  padding: 0;
  transform: translateY(-26px);
  margin-left: 32px;
  i {
    margin-right: 4px;
  }
  .suc,
  .suc i {
    color: green;
  }
  .warn,
  .warn i {
    color: orange;
  }
  .err,
  .err i {
    color: red;
  }
}
</style>
