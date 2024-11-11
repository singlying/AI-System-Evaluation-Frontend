<template>
<el-header>
            <el-card style="width: 480px" shadow="always" v-if="modelSelect">请选择需要评估的模型</el-card>

            <el-card style="width: 480px" shadow="always" v-if="typeSelect">请选择需要评估的指标</el-card>
        </el-header>
</template>
<script>
//import NavBar from "../../src/components/NavBar/NavBar";
import axios from "axios"

export default {
    components: {

    },
    data() {
        return {
            modelId: null,
        };
    },
    created() {
    this.modelId = parseInt(this.$route.query.modelId);
    
    },
    methods: {
       
    }
};
</script>