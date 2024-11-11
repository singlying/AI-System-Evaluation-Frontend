<template>
    <el-container>
        <el-dialog v-model="resultVisible" :before-close="handleClose">
            测试请求已提交！
        </el-dialog>
        <el-header>
            <el-card shadow="always" v-if="modelSelect">请选择需要评估的模型</el-card>
            <el-card shadow="always" v-if="dataSelect">请选择需要使用的数据集</el-card>
            <el-card shadow="always" v-if="dataProcess">数据预处理</el-card>
            <el-card shadow="always" v-if="typeSelect">请选择需要评估的指标</el-card>
            <el-card shadow="always" v-if="attackSelect">请输入相关参数</el-card>
            <el-card shadow="always" v-if="featureSelect">请选择敏感特征</el-card>
        </el-header>
        <el-main>
            <el-container style="background:#f4f4f5" v-if="modelSelect">
                <el-main style="margin:20px 30px;background:#fff;">
                    <el-row style="margin-bottom: 5px;">
                        <el-col :span="6">
                            <el-input v-model="input" class="w-50 m-2" placeholder="搜索" :prefix-icon="Search" />
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="handleSearchModel">搜索</el-button>
                        </el-col>

                    </el-row>
                    <el-row gutter="10" justify="center" style="flex-wrap: wrap;">
                        <el-col :lg="{ span: 7 }" v-for="(model, index) in modelList" :key="index" style="margin: 5px">
                            <el-card :body-style="{ padding: '5px' }" @click="selectModel(model)">

                                <div style="padding: 14px; font-size: 12px;">
                                    <div>
                                        <el-icon>
                                            <Notebook />
                                        </el-icon>
                                        <span>{{ model.name }}</span>


                                    </div>
                                </div>
                                <div style="padding: 14px; font-size: 12px;">
                                    <div>


                                        <el-tag v-if="model.missionType == 1">图像分类</el-tag>
                                        <el-tag v-if="model.missionType == 2">图像检索</el-tag>

                                    </div>
                                </div>

                            </el-card>

                        </el-col>
                    </el-row>
                    <el-row justify="center"><el-col :span="11">
                    <div>
                        <el-pagination layout="prev, pager, next" :total="modelTotal" v-model:current-page="modelPage"
                            @current-change="getNewModelPage" :page-size="12"/>
                    </div>
                </el-col></el-row>
                </el-main>
            </el-container>
            <el-container style="background:#f4f4f5" v-if="dataSelect">
                <el-main style="margin:20px 30px;background:#fff;">
                    <el-row style="margin-bottom: 5px;">
                        <el-col :span="6">
                            <el-input v-model="input" class="w-50 m-2" placeholder="搜索" :prefix-icon="Search" />
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="handleSearchDataset">搜索</el-button>
                        </el-col>

                    </el-row>
                    <el-row gutter="20" justify="center" style="flex-wrap: wrap">
                        <el-col :lg="{ span: 8 }" v-for="(dataset, index) in datasetList" :key="index">
                            <el-card :body-style="{ padding: '0px' }" @click="selectData(dataset)">
                                <div style="padding: 14px; font-size: 12px;">
                                    <div>
                                        <el-icon>
                                            <Files />
                                        </el-icon>
                                        <span>{{ dataset.name }}</span>
                                        <el-tag v-if="dataset.type == 1">图像</el-tag>

                                    </div>
                                </div>


                            </el-card>

                        </el-col>
                    </el-row>
                    <el-row justify="center"><el-col :span="11">
                    <div>
                        <el-pagination layout="prev, pager, next" :total="datasetTotal" v-model:current-page="datasetPage"
                            @current-change="getNewDatasetPage" :page-size="12"/>
                    </div>
                </el-col></el-row>
                </el-main>
            </el-container>
            <el-container style="background:#f4f4f5" v-if="dataProcess">
                <el-form :model="form" label-width="auto" style="max-width: 600px">
                    <el-form-item label="Resize">
                        <el-switch v-model="form.enableResize" />
                        <div v-if="form.enableResize">
                            <el-input v-model="form.resize1" style="width: 30%" />*<el-input v-model="form.resize2"
                                style="width: 30%" />
                        </div>
                    </el-form-item>
                    <el-form-item label="Normalize">
                        <el-switch v-model="form.enableNormalize" />
                        <div v-if="form.enableNormalize">
                            <el-form-item label="Mean">

                                <el-input v-model="form.mean1" style="width: 30%" /><el-input v-model="form.mean2"
                                    style="width: 30%" /><el-input v-model="form.mean3" style="width: 30%" />

                            </el-form-item>
                            <el-form-item label="Std">

                                <el-input v-model="form.std1" style="width: 30%" /><el-input v-model="form.std2"
                                    style="width: 30%" /><el-input v-model="form.std3" style="width: 30%" />

                            </el-form-item>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-container>
            <el-container style="background:#f4f4f5" v-if="typeSelect">
                <el-main style="margin:20px 30px;background:#fff;">
                    <el-row gutter="20" justify="center" style="flex-wrap: wrap">
                        <el-col :lg="{ span: 4 }" v-for="(type, index) in typeList" :key="index">
                            <el-card :body-style="{ padding: '0px' }" @click="selectEvalType(type.id)">
                                <el-image src="../../src/assets/book.png" class="image"></el-image>
                                <div style="padding: 14px">
                                    <div>
                                        <span>{{ type.name }}</span>
                                    </div>
                                </div>
                            </el-card>

                        </el-col>
                    </el-row>
                </el-main>
                <el-row>
                    <el-col>

                    </el-col>
                </el-row>

            </el-container>
            <el-container style="background:#f4f4f5" v-if="attackSelect && model.missionType == 1">
                <el-form :model="attackForm" label-width="auto" style="max-width: 600px">

                    <el-form-item label="扰动大小">
                        <el-input v-model="attackForm.eps" style="width: 30%" />
                    </el-form-item>
                    <el-form-item label="扰动步长">
                        <el-input v-model="attackForm.epsStep" style="width: 30%" />
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="onSubmitAttack">确认</el-button>
                    </el-form-item>

                </el-form>
            </el-container>
            
            <el-container style="background:#f4f4f5" v-if="featureSelect">
                <el-form :model="attackForm" label-width="auto" style="max-width: 600px">
                    <el-form-item label="敏感特征">
                        <el-select v-model="featureForm.feature" placeholder="origin" size="large" style="width: 240px">
                            <el-option v-for="item in featureOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="model.missionType == 1" label="正类">
                        <el-select v-model="featureForm.posLabel" placeholder="3" size="large" style="width: 240px">
                            <el-option v-for="item in posOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFeature">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-container>
        </el-main>
    </el-container>
</template>
<script>
//import NavBar from "../../src/components/NavBar/NavBar";
import axios from "axios"
import {

    Notebook,
    Files,

} from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    components: {
        Notebook,
        Files,
    },
    data() {
        return {
            resultVisible: false,
            modelList: [],
            datasetList: [],
            model: {},
            dataset: {},
            form: {
                enableNormalize: true,
                enableResize: true,
            },
            featureForm: {
                feature: 1,
                posLabel: 3,
            },
            attackForm: {
                eps: 1,
                epsStep: 0.1,
                lr: 0.01,
                confidence: 0,
                rotation: 30,
                noiseLevel: 0.5,
                quality: 20,

            },
            featureOptions: [{
                label: "origin",
                value: "origin"
            }],
            posOptions: [{
                label: "3",
                value: 3,
            }],
            dataProcess: false,
            modelSelect: true,
            typeSelect: false,
            dataSelect: false,
            featureSelect: false,
            modelPage: 1,
            datasetPage: 1,
            modelTotal: 1,
            datasetTotal: 1,
            evalType: null,
            modelId: null,
            modelName: null,
            input: null,
            modelList: [{
                name: "aaa",
                id: 1,
            },],
            datasetList: [{
                name: "ddd",
                id: 1
            },],
            typeList: [{
                name: "准确性评估",
                id: 1
            }, {
                name: "鲁棒性评估",
                id: 2
            },
            {
                name: "公平性评估",
                id: 3
            }]
        };
    },
    created() {
        axios({
            method: 'get',
            baseURL: import.meta.env.VITE_APP_BASE_API,
            url: '/api/getModel',
            params: {
                page: 1
            }

        }).then((res) => {
            console.log("res", res);
            this.modelList = res.data;
        });
        axios({
            method: 'get',
            baseURL: import.meta.env.VITE_APP_BASE_API,
            url: '/api/getDataset',
            params: {
               page: 1
            }

        }).then((res) => {
            console.log("res", res);
            this.datasetList = res.data;
        });
    },
    methods: {
        handleModelSearch() {
            if (this.input == ""){
                this.getNewModelPage();
                return;
            }
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/searchModel',
                params: {
                    keyword: this.input,
                }
            }).then((res) => {
                console.log("res", res);
                this.modelList = res.data
            });
            
        },
        handleDatasetSearch() {
            if (this.input == ""){
                this.getNewDatasetPage();
                return;
            }
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/searchDataset',
                params: {
                    keyword: this.input,
                }
            }).then((res) => {
                console.log("res", res);
                this.datasetList = res.data
            });
            
        },
        getDataset(page) {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/getDataset',
                params: {
                    page: page,
                }
            }).then((res) => {
                console.log("res", res);
                this.datasetList = res.data
            });
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/getDatasetTotal',
                
            }).then((res) => {
                console.log("res", res);
                this.datasetTotal = res.data;
            });
        },

        getModel(page) {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/getModel',
                params: {
                    page: page,
                }
            }).then((res) => {
                console.log("res", res);
                this.modelList = res.data
            });
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/getModelTotal',
                
            }).then((res) => {
                console.log("res", res);
                this.modelTotal = res.data;
            });
        },
        selectModel(model) {
            this.model = model
            this.modelSelect = false;
            this.dataSelect = true;
        },
        selectData(dataset) {
            this.dataset = dataset;
            this.dataSelect = false;
            this.dataProcess = true;
            this.form.resize1 = this.model.width;
            this.form.resize2 = this.model.height;
            this.form.mean1 = dataset.mean1;
            this.form.mean2 = dataset.mean2;
            this.form.mean3 = dataset.mean3;
            this.form.std1 = dataset.std1;
            this.form.std2 = dataset.std2;
            this.form.std3 = dataset.std3;

        },
        onSubmit() {
            if (this.form.resizeEnable){
                if (this.form.resize1 <= 0 || this.form.resize2 <= 0){
                    ElMessage.error("请输入有效的值！");
                    return;
                }
            }
            this.dataProcess = false;
            this.typeSelect = true;
        },
        onSubmitAttack() {
            const jsondata = {
                missionType: this.model.missionType,
                modelId: this.model.id,
                datasetId: this.dataset.id,
                form: this.form,
                attackForm: this.attackForm
            }
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/robustness',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsondata,
            }).then((res) => {
                console.log("res", res);
                this.resultVisible = true;
            });
        },
        onSubmitRB() {
            const jsondata = {
                missionType: this.model.missionType,
                modelId: this.model.id,
                datasetId: this.dataset.id,
                form: this.form,
                attackForm: this.attackForm
            }
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/robustness',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsondata,
            }).then((res) => {
                console.log("res", res);
                this.resultVisible = true;
            });
        },
        getNewModelPage(){
            this.getModel(this.modelPage);
        },
        getNewDatasetPage(){
            this.getDataset(this.datasetPage);
        },
        onSubmitFeature() {
            const jsondata = {
                missionType: this.model.missionType,
                modelId: this.model.id,
                datasetId: this.dataset.id,
                form: this.form,
                featureForm: this.featureForm
            }
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/fairness',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsondata,
            }).then((res) => {
                console.log("res", res);
                this.resultVisible = true;
            });
        },
        selectEvalType(id) {
            this.evalType = id;
            console.log(this.model.missionType);
            if (id == 1) {

                const jsondata = {
                    missionType: this.model.missionType,
                    modelId: this.model.id,
                    datasetId: this.dataset.id,
                    form: this.form,

                }
                axios({
                    method: 'post',
                    baseURL: import.meta.env.VITE_APP_BASE_API,
                    url: '/api/accuracy',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: jsondata,
                }).then((res) => {
                    console.log("res", res);
                    this.resultVisible = true;
                });
            } else if (id == 2) {
                if (this.model.missionType == 1){
                    this.onSubmitAttack();
                }
                else {
                    this.onSubmitRB();
                }
                
            } else if (id == 3) {
                this.onSubmitFeature();
            }
        },
        handleClose() {
            this.$router.push({
                path: "/record",
                
            });
        }

    }
};
</script>