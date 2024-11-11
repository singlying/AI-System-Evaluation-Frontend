<template>
    <el-container>
        <el-dialog v-model="uploadResultVisible" title="上传结果">
            {{ this.result }}
        </el-dialog>
        <el-header>
            <el-card style="" shadow="always">数据集管理</el-card>
        </el-header>
        <el-dialog v-model="uploadVisible" title="上传" >
            <el-form :model="form" label-width="auto" style="max-width: 600px" v-loading="loading" >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="介绍" prop="description">
                    <el-input v-model="form.description" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" size="large">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="数据文件" @change="handleDataUpload">
                    <el-input type="file" v-model="form.def"  accept=".zip,.tar.gz,.tar.bz2"/>
                </el-form-item>
                <el-form-item label="标签文件" @change="handleLabelUpload">
                    <el-input type="file" v-model="form.weight" accept=".csv" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit()">确认</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
        <el-dialog v-model="deleteVisible" title="确认" width="30%">
            <span>真的要删除吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteVisible = false">取消</el-button>
                    <el-button type="primary" @click="deleteDataset">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        
        <el-dialog v-model="resultVisible" width="90%">
            <el-table :data="resultDatasetList" stripe style="width: 100%">
                    <el-table-column prop="id" label="ID" />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="description" label="介绍" />
                    <el-table-column prop="type" label="类型">
                        <template #default="scope">
                            <div>
                                <el-tag v-if="scope.row.type == 1">图像</el-tag>
                                <el-tag v-if="scope.row.type == 2">图像</el-tag>
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
            <el-row> <el-table :data="datasetList" stripe style="width: 100%">
                    <el-table-column prop="id" label="ID" />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="description" label="介绍" />
                    <el-table-column prop="type" label="类型">
                        <template #default="scope">
                            <div>
                                <el-tag v-if="scope.row.type == 1">图像</el-tag>
                                <el-tag v-if="scope.row.type == 2">图像</el-tag>
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
import store from "@/store";
import { ElMessage } from "element-plus";
import { timePanelSharedProps } from "element-plus/es/components/time-picker/src/props/shared";
export default {
    data() {
        return {
            datasetList: [],
            readerInput: '',
            input: '',
            uploadVisible: false,
            deleteVisible: false,
            dialogFormVisible: false,
            uploadResultVisible: false,
            deleteVisible: false,
            dataFile: null,
            labelFile: null,
            deleteId: null,
            options: [{
                label: "图像",
                value: 1,
            },
            ],
            total: 1,
            page: 1,
            dialogTitle: '',
            form: {},
            resultDatasetList: [],
            resultVisible: false,
            loading: false,
          

        }
    },
    created() {
        this.getDataset(1);
    },
    methods: {
        getNewPage(){
            this.getDataset(this.page);
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
            if (!this.form.type) {
                ElMessage.error("请选择数据集类型！");
                return
            }
            if (!this.dataFile) {
                ElMessage.error("请上传数据文件！");
                return
            }
            if (!this.labelFile) {
                ElMessage.error("请上传标签文件！");
                return
            }
            this.upload();
        },
        upload() {
            this.loading = true;
            const formData = new FormData();
            formData.append('dataFile', this.dataFile);
            formData.append('labelFile', this.labelFile);
            formData.append('name', this.form.name);
            formData.append('description', this.form.description)
            formData.append('type', this.form.type)
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/addDataset',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            }).then((res) => {
                this.uploadVisible = false;
                this.result = res.data;
                this.uploadResultVisible = true;
                this.loading = false;
                this.getDataset(1);
                this.page = 1;
            });
        },
       
        validateFileExtension(file, expectedExtension) {
            const fileName = file.name;
            const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            return fileExtension === expectedExtension.toLowerCase();
        },
        handleDataUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (this.validateFileExtension(file, '.zip') || this.validateFileExtension(file, '.tar.gz')|| this.validateFileExtension(file, '.tar.bz2')) {
                    this.dataFile = file;
                   
                } else {
                    ElMessage.error("请上传正确的文件！");
                    event.target.value = ''; // 清除输入框的值
                }
            }
        },
        handleLabelUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (this.validateFileExtension(file, '.csv')) {
                    this.labelFile = file;
                   
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
                url: '/api/searchDataset',
                params: {
                    keyword: this.input,
                }
            }).then((res) => {
                console.log("res", res);
                this.resultRecordList = res.data
            });
            this.resultVisible = true;
        },
        handleCreate() {
            this.form = {};
            this.uploadVisible = true;
        },
       
        deleteDataset() {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/deleteDataset',
                params: {
                    id: this.deleteId,

                }
            }).then((res) => {
                console.log("res", res);
                this.getDataset(1);
                this.page = 1;
                this.deleteVisible = false;
                this.resultVisible = false;
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
                this.total = res.data;
            });
        },


    },
}
</script>