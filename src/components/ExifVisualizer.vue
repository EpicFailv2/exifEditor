<template>
  <section>
    <!-- header -->
    <v-row justify="space-between">
      <v-col cols="auto">
        <h2>EXIF data</h2>
      </v-col>
      <v-col cols="auto">
        <v-menu v-model="addMenu" top :close-on-content-click="false" min-width="300px" max-height="80vh">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon>{{ $t("exif.add") }}</v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-text-field v-model="tagSearch" :label="$t('exif.filter')" clearable></v-text-field>
            </v-list-item>
            <v-list-group v-for="group in filteredTagsLikeKeys" :key="'menuGroup_' + group.key">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ $t("exif.groupName." + group.key) }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="val in group.keys" :key="'menuItem_' + val.key" link>
                <v-list-item-title @click="add(group.key, val)">{{ val.name }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <!-- content -->
    <div v-for="group in keys" :key="group.key">
      <h2 class="groupHeader">{{ $t("exif.group", { group: $t("exif.groupName." + group.key) }) }}</h2>
      <v-row v-for="val in group.keys" :key="val.key" align="center">
        <template v-if="typeof exifObj[group.key][val.key] === 'object'">
          <!-- if value is array of arrays -->
          <template v-if="typeof exifObj[group.key][val.key][0] === 'object'">
            <v-col v-for="(val2, i) in exifObj[group.key][val.key]" :key="val.key + '_x' + i" :id="group.key + '.' + val.key">
              <div v-if="!i" class="labelLike">{{ val.name }}</div>
              <div v-for="(val3, j) in exifObj[group.key][val.key][i]" :key="val.key + '_x' + i + '_y' + j" :class="{ smushTop: j }">
                <v-text-field v-model="exifObj[group.key][val.key][i][j]" :type="val.inputType"></v-text-field>
              </div>
              <div v-if="!i" class="messageLike">{{ "type " + val.type + " [" + val.inputType + "]" }}</div>
            </v-col>
            <v-col class="noGrow"><v-icon @click="removeValue(group.key, val.key)">mdi-close</v-icon></v-col>
          </template>

          <!-- if value is array -->
          <template v-else>
            <v-col v-for="(val2, i) in exifObj[group.key][val.key]" :key="val.key + '_x' + i" :id="group.key + '.' + val.key">
              <v-text-field
                v-model="exifObj[group.key][val.key][i]"
                :label="!i ? val.name : ''"
                :type="val.inputType"
                :hint="!i ? 'type ' + val.type + ' [' + val.inputType + ']' : null"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col class="noGrow"><v-icon @click="removeValue(group.key, val.key)">mdi-close</v-icon></v-col>
          </template>
        </template>

        <template v-else>
          <v-col :id="group.key + '.' + val.key">
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
import { jsonClone, scrollToElement } from "../utils/commonFunctions";
export default {
  name: "exif-visualizer",
  props: { exifObj: { type: Object, required: true } },
  components: {},
  data: () => ({
    tags: piexif.TAGS,
    addMenu: false,
    tagSearch: null
  }),
  mounted() {
    console.log("exifObj", this.exifObj);
    console.log("tags", this.tags);
    console.log("tagsLikeKeys", this.tagsLikeKeys);
  },
  methods: {
    // NOTES: possible types of inputs: { "Ascii": 63, "Long": 63, "Short": 133, "Rational": 74, "Byte": 55, "Undefined": 37, "SRational": 30, "Float": 7 }
    removeValue(groupKey, valKey) {
      if (!groupKey || !valKey) return;
      Vue.delete(this.exifObj[groupKey], valKey);
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
    keys() {
      return this.$store.state.exif.exifObjToKeys(this.exifObj);
    },
    tagsLikeKeys() {
      return this.$store.state.exif.exifObjToKeys(this.tags).sort((a, b) => a.key.localeCompare(b.key));
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
.groupHeader {
  margin: 32px 0 16px 24px;
}

.labelLike,
.messageLike {
  margin: 0;
  color: hsla(0, 0%, 100%, 0.7);
  height: 20px;
  font-size: 12px;
}
.labelLike {
  transform: translateY(18px);
}
.messageLike {
  transform: translateY(-18px);
}
.smushTop > div {
  padding-top: 0;
  margin-top: 0;
}
</style>
