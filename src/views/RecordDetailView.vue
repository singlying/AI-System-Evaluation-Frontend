<template>
  <el-container>
    <el-header>
      <el-card shadow="always">记录详情</el-card>
    </el-header>
    <el-main v-if="type == 1 && missionType == 1">

      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Accuracy（准确率） :模型的正确预测结果占所有预测结果的比例。" placement="top">
          <el-descriptions title="准确率" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Accuracy">{{ accuracy }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>

        <el-tooltip class="box-item" effect="dark" content="分别计算每个类别的指标，然后对这些指标取算术平均值" placement="top">
          <el-descriptions title="宏平均" direction="vertical" style="margin: 1%" border>

            <el-descriptions-item label="Recall">{{ macroAvg.recall }}</el-descriptions-item>
            <el-descriptions-item label="Precision">{{ macroAvg.precision }}</el-descriptions-item>
            <el-descriptions-item label="F1 Score">{{ macroAvg.f1Score }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="根据每个类别的样本数量进行加权" placement="top">
          <el-descriptions title="加权平均" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Recall">{{ weightedAvg.recall }}</el-descriptions-item>
            <el-descriptions-item label="Precision">{{ weightedAvg.precision }}</el-descriptions-item>
            <el-descriptions-item label="F1 Score">{{ weightedAvg.f1Score }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row v-for="category in categories">

        <el-tooltip class="box-item" effect="dark" content="precision：每个类别的精确率。
recall：每个类别的召回率。
f1-score：每个类别的 F1 分数（精确率和召回率的调和平均数）。
support：每个类别的样本数量。" placement="top">
          <el-descriptions :title="category.category" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Category">{{ category.category }}</el-descriptions-item>
            <el-descriptions-item label="Recall">{{ category.recall }}</el-descriptions-item>
            <el-descriptions-item label="Precision">{{ category.precision }}</el-descriptions-item>
            <el-descriptions-item label="F1 Score">{{ category.f1Score }}</el-descriptions-item>
            <el-descriptions-item label="Support">{{ category.support }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>


      </el-row>
    </el-main>
    <el-main v-if="type == 1 && missionType == 2">
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Top K Accuracy :正确的目标是否出现在返回的前 K 个检索结果中。" placement="top">
          <el-descriptions direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Top K Accuracy">{{ top_k_accuracy }}</el-descriptions-item>
            <el-descriptions-item label="K">{{ k }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Mean Average Precision (mAP)：所有查询中平均准确率（AP）的平均值。AP 计算了在每个阈值上的精确率，并取这些精确率的平均值。
        ROC AUC：ROC曲线下面积，值越大表示模型性能越好。" placement="top">
          <el-descriptions direction="vertical" style="margin: 1%" border>

            <el-descriptions-item label="mAP">{{ map }}</el-descriptions-item>


            <el-descriptions-item label="ROC_AUC">{{ roc_auc }}</el-descriptions-item>


          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Precision-Recall曲线：绘制了不同阈值下的精确率（Precision）和召回率（Recall）"
          placement="top">
          <img :src="img" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>
        </el-tooltip>
      </el-row>
    </el-main>
    <el-main v-if="type == 2 && missionType == 1">
      <el-row>
        <el-tooltip class="box-item" effect="dark"
          content="Empirical Robustness（经验鲁棒性）通过在不同强度的攻击下测量模型的表现来评估模型的鲁棒性，此处采用FGSM。Loss Sensitivity 衡量的是模型在输入扰动下损失函数的变化程度。损失敏感度越低，模型越鲁棒。Accuracy(DeepFool)：使用DeepFool算法攻击后的准确率。"
          placement="top">
          <el-descriptions direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Empirical Robustness">{{ emp_robustness }}</el-descriptions-item>
            <el-descriptions-item label="Loss Sensitivity">{{ sensitivity }}</el-descriptions-item>
            <el-descriptions-item label="Accuracy(DeepFool)">{{ deepfool }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>

      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Security Curve展示了模型在不同强度攻击下的表现。此处采用FGSM。"
          placement="top">
          <img :src="img" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>
        </el-tooltip>
      </el-row>




    </el-main>
    <el-main v-if="type == 2 && missionType == 2">
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="添加扰动前的mAP与Top 5 Accuracy" placement="top">
          <el-descriptions direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Original mAP">{{ map }}</el-descriptions-item>
            <el-descriptions-item label="Original Top 5 Accuracy">{{ top_k_accuracy }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>

      <el-row>
        <el-tooltip class="box-item" effect="dark" content="模型在不同噪声水平下的性能" placement="top">
          <img :src="img" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="模型在不同旋转角度下的性能" placement="top">
          <img :src="img2" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="模型在不同压缩质量下的性能" placement="top">
          <img :src="img3" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>
        </el-tooltip>
      </el-row>




    </el-main>
    <el-main v-if="type == 3 && missionType == 1">
      <el-row>
        <el-descriptions title="正类" direction="vertical" style="margin: 1%" border>

        </el-descriptions>
        <el-tooltip class="box-item" effect="dark" content="选择正类标签" placement="top">
          <el-select v-model="posLabel" placeholder="请选择" size="large" @change="labelChange">
            <el-option v-for="item in options" :key="item" :label="item" :value="item" />
          </el-select>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Selection Rate（选择率）：模型预测为正类的样本占总样本数的比例" placement="top">
          <el-descriptions title="Selection Rate" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.selection_rate
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Recall（召回率）：反映了模型从实际正类样本中成功识别出的比例" placement="top">
          <el-descriptions title="Recall" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.selection_rate
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="Precision（精确率） ：反映了模型预测为正类的样本中实际为正类的比例" placement="top">
          <el-descriptions title="Precision" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.precision
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>

      <el-row>
        <el-tooltip class="box-item" effect="dark" content="False Positive Rate（假阳性率）：反映了模型将实际为负类的样本错误地预测为正类的比例"
          placement="top">
          <el-descriptions title="False Positive Rate" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.false_positive_rate
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="False Negative Rate（假阴性率）：反映了模型将实际为正类的样本错误地预测为负类的比例"
          placement="top">
          <el-descriptions title="False Negative Rate" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.false_negative_rate
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="不同群体的样本数" placement="top">
          <el-descriptions title="Count" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.count
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark"
          content="Demographic Parity（人口统计平等） ：衡量模型选择率是否在不同的敏感特征群体之间保持一致。difference：不同群体间选择率的差异。值越接近0，表示模型在不同群体间的选择率越接近，即越公平。ratio：衡量不同群体间选择率的比例。值越接近1，表示模型在不同群体间的选择率越接近，即越公平。"
          placement="top">
          <el-descriptions title="Demographic Parity" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Difference">{{ demo_diff }}</el-descriptions-item>
            <el-descriptions-item label="Ratio">{{ demo_ratio }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark"
          content="Equalized Odds（平等机会）：衡量模型在不同的敏感特征群体中是否具有相同的真阳性率（True Positive Rate, TPR）和假阳性率（False Positive Rate, FPR）。 Difference：衡量不同敏感特征群体间的真阳性率和假阳性率的差异。值越接近0，表示模型在不同群体间的预测表现越接近，即越公平。Ratio：衡量不同敏感特征群体间的真阳性率和假阳性率的比例。值越接近1，表示模型在不同群体间的预测表现越接近，即越公平。"
          placement="top">
          <el-descriptions title="Equalized Odds" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Difference">{{ odds_diff }}</el-descriptions-item>
            <el-descriptions-item label="Ratio">{{ odds_ratio }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <img :src="img" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>

      </el-row>

    </el-main>
    <el-main v-if="type == 3 && missionType == 2">
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="不同群体间最大和最小 mAP 之间的差距" placement="top">
          <el-descriptions title="Fairness Gap" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item label="Fairness Gap">{{ fairness_gap
              }}</el-descriptions-item>
          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="不同群体中的Top 5 Accuracy" placement="top">
          <el-descriptions title="Top 5 Accuracy" direction="vertical" style="margin: 1%" border>
            <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.top_k_accuracy
              }}</el-descriptions-item>

          </el-descriptions>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-tooltip class="box-item" effect="dark" content="不同群体中的mAP" placement="top">

        <el-descriptions title="Group mAP Score" direction="vertical" style="margin: 1%" border>
          <el-descriptions-item v-for="feature in features" :label="feature.name">{{ feature.group_map_score
            }}</el-descriptions-item>
        </el-descriptions>
        </el-tooltip>
      </el-row>

      <el-row>
        <img :src="img" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>

      </el-row>
      <el-row>
        <img :src="img2" style="max-width: 1000px;
  max-height: 1000px;
  width: auto;
  height: auto;"></img>

      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";


export default {
  data() {
    return {
      options: [],
      posLabel: 0,
      content: {},
      categories: [],
      features: [],
      record: {

      },
      contents: [],
      img: null,
      img2: null,
      img3: null,
      top_k_accuracy: null,
      k: null,
      map: null,
      roc_auc: null,
      odds_diff: null,
      odds_ratio: null,
      demo_diff: null,
      demo_ratio: null,
      fairnessVisibile: false,
      emp_robustness: null,
      sensitivity: null,
      accuracyVisible: true,
      robustnessVisible: false,
      accuracy: null,
      fairness_gap: null,
      type: 1,
      macroAvg: {},
      weightedAvg: {},
      deepfool: null,
    };
  },
  methods: {
    labelChange() {
      this.getFairness(this.posLabel);
    },
    getDate(n) {
      n = new Date(n * 1000);
      return (
        n.toLocaleDateString().replace(/\//g, "-") +
        " " +
        n.toTimeString().substr(0, 8)
      );
    },
    getAccuracy() {
      if (this.content) {

        // 遍历 JSON 数据中的键
        for (const key in this.content) {
          if (this.content.hasOwnProperty(key)) {
            // 获取当前类别的数据
            if (key !== 'accuracy' && key !== 'macro avg' && key !== 'weighted avg') {
              // 存储类别数据
              this.categories.push({
                category: key,
                precision: this.content[key].precision,
                recall: this.content[key].recall,
                f1Score: this.content[key]['f1-score'],
                support: this.content[key].support,
              });
            }
          }
        }
        this.accuracy = this.content.accuracy;

        // 存储宏平均
        this.macroAvg = {
          precision: this.content['macro avg'].precision,
          recall: this.content['macro avg'].recall,
          f1Score: this.content['macro avg']['f1-score'],
        };

        // 存储加权平均
        this.weightedAvg = {
          precision: this.content['weighted avg'].precision,
          recall: this.content['weighted avg'].recall,
          f1Score: this.content['weighted avg']['f1-score'],
        };
      }
    },
    getRobustness() {
      if (this.content) {


        this.img = this.content.image;
        this.img = 'data:image/png;base64,' + this.img;

        this.emp_robustness = this.content.emp_robustness;

        this.sensitivity = this.content.loss_sensitivity;
        this.deepfool = this.content.deepfool;


      }
    },
    getRB() {
      if (this.content) {



        this.img = this.content.img1;
        this.img = 'data:image/png;base64,' + this.img;

        this.img2 = this.content.img2;
        this.img2 = 'data:image/png;base64,' + this.img2;

        this.img3 = this.content.img3;
        this.img3 = 'data:image/png;base64,' + this.img3;

        this.map = this.content.map;

        this.top_k_accuracy = this.content.top_k_accuracy;
      }
    },
    getRF() {
      if (this.content) {



        this.img = this.content.img1;
        this.img = 'data:image/png;base64,' + this.img;

        this.img2 = this.content.img2;
        this.img2 = 'data:image/png;base64,' + this.img2;

        for (const key in this.content['group_map_scores']) {
          if (this.content['group_map_scores'].hasOwnProperty(key)) {
            this.features.push({
              name: key,
              group_map_score: this.content['group_map_scores'][key],
              top_k_accuracy: this.content['top_k_accuracy'][key],

            })
          }
        }



        this.fairness_gap = this.content.fairness_gap;
      }
    },
    getRetrieval() {
      if (this.content) {




        this.img = this.content.img;
        this.img = 'data:image/png;base64,' + this.img;

        this.map = this.content.map;

        this.top_k_accuracy = this.content.top_k_accuracy;

        this.roc_auc = this.content.roc_auc;
        this.k = this.content.k;
      }
    },
    getFairness(index) {
      if (this.content) {
        this.features = [];
        const content = this.content[index];
        //content = JSON.parse(content);
        // 遍历 JSON 数据中的键
        for (const key in content['count']) {
          if (content['count'].hasOwnProperty(key)) {
            this.features.push({
              name: key,
              selection_rate: content['selection rate'][key],
              count: content['count'][key],
              precision: content['precision'][key],
              recall: content['recall'][key],
              false_positive_rate: content['false positive rate'][key],
              false_negative_rate: content['false negative rate'][key],
            })
          }
        }
        console.log("features", this.features)
        this.img = content.image;
        this.img = 'data:image/png;base64,' + this.img;
        console.log(this.img);
        this.demo_diff = content['demographic parity difference'];
        this.demo_ratio = content['demographic parity ratio'];
        this.odds_diff = content['equalized odds difference'];
        this.odds_ratio = content['equalized odds ratio'];





      }
    },
    generateArray(n) {
      return Array.from({ length: n + 1 }, (v, k) => k);
    }

  },
  created() {
    this.id = parseInt(this.$route.query.id);
    this.type = parseInt(this.$route.query.type);
    this.missionType = parseInt(this.$route.query.missionType);
    axios({
      method: 'get',
      baseURL: import.meta.env.VITE_APP_BASE_API,
      url: '/api/getRecordById',
      params: {
        id: this.id
      }

    }).then((res) => {
      console.log("res", res);
      this.record = res.data;
      this.content = this.record.content;
      this.content = JSON.parse(this.content)
      console.log("t", this.content);
      if (this.type == 1) {
        if (this.missionType == 1) {
          this.getAccuracy();
        }
        else if (this.missionType == 2) {
          this.getRetrieval();
        }

      }
      else if (this.type == 2) {
        if (this.missionType == 1) {
          this.getRobustness();
        }
        else if (this.missionType == 2) {
          this.getRB();
        }

      }
      else if (this.type == 3) {
        if (this.missionType == 1) {
          const size = this.content.length;
          this.options = this.generateArray(size - 1);
          this.getFairness(0);
        }
        else if (this.missionType == 2) {
          this.getRF();
        }

      }
    });


    //this.content = JSON.parse(this.record.content);




  }
}

</script>

<style scoped></style>