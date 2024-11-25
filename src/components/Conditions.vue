<script setup>
defineProps({
  condition: {
    type: Object,
    required: true,
  }
});
</script>
<template>
    <div class="cpoe__condition__container">
        <div class="cpoe__btn__array">
            <div class="cpoe__btn__update">
                <v-btn icon="mdi-pencil" variant="tonal" size="x-small"></v-btn>
            </div>
            <div class="spacer"></div>
            <div class="cpoe__btn__delete">
                <v-btn icon="mdi-delete" variant="tonal" size="x-small" color="error"></v-btn>
            </div>
        </div>
        <div>
            Reference: {{condition.reference}}
        </div>
        <div>
            Calories: 20
        </div>
        <div>
            Product: {{ condition.theFortifierParser[0].FortifierKey }}
        </div>
        <div>
            Cal/Oz Start: {{ condition.theFortifierParser[0].CalOzStart }}
        </div>
        <div>
            Cal/Oz End: {{ condition.theFortifierParser[0].CalOzEnd }}
        </div>
        <div>
            Modular: {{ condition.theFortifierParser[0].Modular }}
        </div>
    </div>
</template>
<style scoped>
.cpoe__condition__container{
    padding: 10px 15px;
    border: 0.5px solid gray;
    margin: 0px 10px;
    border-radius: 15px;
}
.cpoe__btn__array{
    display: flex;
    justify-content: right;
}
.spacer{
    padding: 0px 2px;
}
</style>