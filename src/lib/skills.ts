// 技能数据定义，从 Home.tsx 提取

export interface SkillItem {
  name: string;
  width: string;
  desc: string;
}

export const SKILLS: SkillItem[] = [
  {
    name: 'React / React Native / Expo',
    width: '70%',
    desc: '使用 Expo 参与完成教育软件 步刻AI 等等项目开发，主要负责APP前端部分',
  },
  {
    name: 'Vue / uniapp',
    width: '70%',
    desc: '使用 Vue 进行项目前端开发，曾用 uniapp 开发跨端 线上商城 前端项目，着重小程序端开发；以及会议室门锁后台管理系统的前端开发',
  },
  {
    name: 'JavaScript / TypeScript',
    width: '65%',
    desc: '扎实的 JS 基础抽象能力，非常喜爱并习惯使用 TypeScript 进行类型安全的开发以减少潜在的边界边缘错误。',
  },
  {
    name: 'Python',
    width: '40%',
    desc: '熟悉其基本语法规则集，曾在日常生活中作为写自动化脚本、简单正则文本批处理和网络数据采集抓取的工具。',
  },
  {
    name: 'Node.js / Nest.js',
    width: '40%',
    desc: '对 Nest 生态的依赖注入与装饰器等抽象服务端设计有着基本了解。曾参与会议室智能管理系统的后端部分',
  },
  {
    name: 'C / C++',
    width: '60%',
    desc: '作为我参与算法竞赛的主要语言；系统性地学习了底层开发概念，包括基础指针语法和内存的手动管理边界。',
  },
];
