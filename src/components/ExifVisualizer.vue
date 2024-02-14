<template>
  <section>
    <div v-for="group in keys" :key="group.key">
      <h2 class="groupHeader">{{ $t("exif.group", { group: group.key }) }}</h2>
      <v-row v-for="val in group.keys" :key="val.key" align="center">
        <template v-if="typeof exifObj[group.key][val.key] === 'object'">
          <v-col v-for="(val2, i) in exifObj[group.key][val.key]" :key="val.key + '_x' + i">
            <v-text-field
              v-model="exifObj[group.key][val.key][i]"
              :label="!i ? val.name : ''"
              :type="val.inputType"
              :hint="!i ? 'type ' + val.type + ' [' + val.inputType + ']' : null"
              persistent-hint
            ></v-text-field>
          </v-col>
          <v-col style="flex-grow: 0"><v-icon @click="removeValue(group.key, val.key)">mdi-close</v-icon></v-col>
        </template>
        <template v-else>
          <v-col>
            <v-text-field
              v-model="exifObj[group.key][val.key]"
              :label="val.name"
              :type="val.inputType"
              :hint="'type ' + val.type + ' [' + val.inputType + ']'"
              persistent-hint
              append-outer-icon="mdi-close"
              @click:append-outer="removeValue(group.key, val.key)"
            ></v-text-field>
          </v-col>
        </template>
      </v-row>
      <p v-if="!group.keys.length" style="margin-left: 48px">No params</p>
    </div>
  </section>
</template>

<script>
import piexif from "piexifjs";
import Vue from "vue";
const TYPE_MAP = { Ascii: "string", Long: "number", Short: "number", Rational: "number", Byte: "string", Undefined: "string", SRational: "number", Float: "number" };
export default {
  name: "landing",
  props: { exifObj: { type: Object, required: true } },
  components: {},
  data: () => ({ tags: piexif.TAGS }),
  mounted() {
    console.log("exifObj", this.exifObj);
    console.log("tags", this.tags);
  },
  methods: {
    // NOTES: possible types of inputs: { "Ascii": 63, "Long": 63, "Short": 133, "Rational": 74, "Byte": 55, "Undefined": 37, "SRational": 30, "Float": 7 }
    removeValue(groupKey, valKey) {
      if (!groupKey || !valKey) return;
      Vue.delete(this.exifObj[groupKey], valKey);
    }
  },
  computed: {
    keys() {
      return Object.keys(this.exifObj)
        .filter(groupKey => !["thumbnail", "Interop"].includes(groupKey))
        .map(groupKey => ({
          key: groupKey,
          keys: Object.keys(this.exifObj[groupKey]).map(valKey => ({
            key: valKey,
            ...this.tags[groupKey][valKey],
            inputType: TYPE_MAP[this.tags[groupKey][valKey].type]
          }))
        }));
    }
  }
};
</script>

<style scoped lang="scss">
.groupHeader {
  margin: 32px 0 16px 24px;
}
</style>
