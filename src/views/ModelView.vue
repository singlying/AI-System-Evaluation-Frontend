<template>
    <el-container>
        <el-header>
            <el-card style="" shadow="always">模型管理</el-card>
        </el-header>
        <el-dialog v-model="uploadResultVisible" title="上传结果">
            {{ this.result }}
        </el-dialog>
        <el-dialog v-model="deleteVisible" title="确认" width="30%">
            <span>真的要删除吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteVisible = false">取消</el-button>
                    <el-button type="primary" @click="deleteModel">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>


        <el-dialog v-model="uploadVisible" title="上传" >
            <el-form :model="form" label-width="auto" style="max-width: 600px" v-loading="loading" >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="介绍" prop="description">
                    <el-input v-model="form.description" />
                </el-form-item>
                <el-form-item label="任务类型" prop="missionType">
                    <el-select v-model="form.missionType" placeholder="请选择" size="large">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="模型定义文件" @change="handleDefUpload">
                    <el-input type="file" v-model="form.def" accept=".py" />
                </el-form-item>
                <el-form-item label="模型权重文件" @change="handleWeightUpload">
                    <el-input type="file" v-model="form.weight" accept=".pth" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit()">确认</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
       

        <el-dialog v-model="resultVisible" width="90%">
            <el-table :data="resultModelList" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="description" label="介绍" />
                <el-table-column prop="missionType" label="类型">
                    <template #default="scope">
                        <div>
                            <el-tag v-if="scope.row.missionType == 1">图像分类</el-tag>
                            <el-tag v-if="scope.row.missionType == 2">图像检索</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="">更新</el-button>
                        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>
        <el-main>
            <el-row>
                <el-col :span="12">
                    <el-input v-model="input" class="w-50 m-2" placeholder="搜索" :prefix-icon="Search" />
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="handleCreate">添加</el-button>
                </el-col>
            </el-row>
            <el-row><el-table :data="modelList" stripe style="width: 100%">
                    <el-table-column prop="id" label="ID" />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="description" label="介绍" />
                    <el-table-column prop="missionType" label="类型">
                        <template #default="scope">
                            <div>
                                <el-tag v-if="scope.row.missionType == 1">图像分类</el-tag>
                                <el-tag v-if="scope.row.missionType == 2">图像检索</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="">更新</el-button>
                            <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table></el-row>
            <el-row justify="center"><el-col :span="11">
                    <div>
                        <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="page"
                            @current-change="getNewPage" :page-size="12"/>
                    </div>
                </el-col></el-row>

        </el-main>
    </el-container>
</template>
<script>
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import store from "@/store";
export default {
    data() {
        return {
            loading: false,
            modelList: [],
            resultModelList: [],
            defFile: null,
            weightFile: null,
            formRef: null,
            input: '',
            uploadVisible: false,
            deleteVisible: false,
            result: null,
            total: 1,
            page: 1,
            dialogTitle: '',
            form: {},
            formRef: null,
            options: [{
                label: "图像分类",
                value: 1,
            },
            {
                label: "图像检索",
                value: 2,
            }],
            resultVisible: false,


        }
    },
    created() {
        this.getModel(1);
        
    },
    methods: {
        getNewPage(){
            this.getModel(this.page);
        },
        onSubmit() {
            if (!this.form.name) {
                ElMessage.error("请填写名称！");
                return
            }
            if (!this.form.description) {
                ElMessage.error("请填写介绍！");
                return
            }
            if (!this.form.missionType) {
                ElMessage.error("请选择任务类型！");
                return
            }
            if (!this.defFile) {
                ElMessage.error("请上传模型定义文件！");
                return
            }
            if (!this.weightFile) {
                ElMessage.error("请上传权重定义文件！");
                return
            }
            this.upload();
        },
        upload() {
            this.loading = true;
            const formData = new FormData();
            formData.append('def', this.defFile);
            formData.append('weight', this.weightFile);
            formData.append('name', this.form.name);
            formData.append('description', this.form.description)
            formData.append('missionType', this.form.missionType)
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/addModel',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            }).then((res) => {
                this.uploadVisible = false;
                this.result = res.data;
                this.uploadResultVisible = true;
                this.loading = false;
                this.getModel(1);
                this.page = 1;
            });
        },
        validateFileExtension(file, expectedExtension) {
            const fileName = file.name;
            const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            return fileExtension === expectedExtension.toLowerCase();
        },
        handleDefUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (this.validateFileExtension(file, '.py')) {
                    this.defFile = file;
                   
                } else {
                    ElMessage.error("请上传正确的文件！");
                    event.target.value = ''; // 清除输入框的值
                }
            }
        },
        handleWeightUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (this.validateFileExtension(file, '.pth')) {
                    this.weightFile = file;
                   
                } else {
                    ElMessage.error("请上传正确的文件！");
                    event.target.value = ''; // 清除输入框的值
                }
            }
        },


        handleDelete(row) {
            this.deleteId = row.id;
            this.deleteVisible = true;
        },
        handleSearch() {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/searchModel',
                params: {
                    keyword: this.input,
                }
            }).then((res) => {
                console.log("res", res);
                this.resultModelList = res.data
            });
            this.resultVisible = true;
        },
        handleCreate() {
            this.form = {};
            this.uploadVisible = true;
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
                this.total = res.data;
            });
        },
        deleteModel() {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/deleteModel',
                params: {
                    id: this.deleteId,

                }
            }).then((res) => {
                console.log("res", res);
                this.getModel(1);
                this.page = 1;
                this.deleteVisible = false;
                this.resultVisible = false;
            });
        },
        getNewPage() {
            this.getBook(this.page);
        },
        handleUpdate(row) {

        },
        handleSubmit() {


        }




    },
}
</script>