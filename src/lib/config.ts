export interface Reward {
  name: string;
  value: number | boolean;
  unit: string;
}

export interface ScoreRange {
  name: string;
  minScore: number;
  maxScore: number;
  rewards: {
    freeTime: Reward;
    spendingLimit: Reward;
    weeklyAllowance: Reward;
    weekendGame: Reward;
  };
}

export interface ScoreItem {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
}

export interface ScoreItemsConfig {
  addItems: ScoreItem[];
  subtractItems: ScoreItem[];
}

const scoreRanges: ScoreRange[] = [
  {
    name: "优秀",
    minScore: 90,
    maxScore: 100,
    rewards: {
      freeTime: {
        name: "每日自由支配时间",
        value: 20,
        unit: "分钟"
      },
      spendingLimit: {
        name: "每日手表消费额度",
        value: 20,
        unit: "元"
      },
      weeklyAllowance: {
        name: "每周获得零花钱",
        value: 15,
        unit: "元"
      },
      weekendGame: {
        name: "周末游戏时间",
        value: true,
        unit: ""
      }
    }
  },
  {
    name: "良好",
    minScore: 60,
    maxScore: 89,
    rewards: {
      freeTime: {
        name: "每日自由支配时间",
        value: 15,
        unit: "分钟"
      },
      spendingLimit: {
        name: "每日手表消费额度",
        value: 10,
        unit: "元"
      },
      weeklyAllowance: {
        name: "每周获得零花钱",
        value: 10,
        unit: "元"
      },
      weekendGame: {
        name: "周末游戏时间",
        value: false,
        unit: ""
      }
    }
  },
  {
    name: "待提高",
    minScore: 0,
    maxScore: 59,
    rewards: {
      freeTime: {
        name: "每日自由支配时间",
        value: 0,
        unit: "分钟"
      },
      spendingLimit: {
        name: "每日手表消费额度",
        value: 2,
        unit: "元"
      },
      weeklyAllowance: {
        name: "每周获得零花钱",
        value: 5,
        unit: "元"
      },
      weekendGame: {
        name: "周末游戏时间",
        value: false,
        unit: ""
      }
    }
  }
];

const scoreItems: ScoreItemsConfig = {
  addItems: [
    {
      id: "add-1",
      name: "积极完成学习任务",
      minScore: 1,
      maxScore: 3
    },
    {
      id: "add-2",
      name: "取得优秀成绩",
      minScore: 2,
      maxScore: 4
    },
    {
      id: "add-3",
      name: "老师点名表扬",
      minScore: 2,
      maxScore: 4
    },
    {
      id: "add-4",
      name: "争当家务小能手",
      minScore: 2,
      maxScore: 3
    },
    {
      id: "add-5",
      name: "诚信守时",
      minScore: 2,
      maxScore: 3
    },
    {
      id: "add-6",
      name: "彬彬有礼",
      minScore: 1,
      maxScore: 2
    }
  ],
  subtractItems: [
    {
      id: "subtract-1",
      name: "拒绝完成学习任务",
      minScore: 1,
      maxScore: 3
    },
    {
      id: "subtract-2",
      name: "考试考砸了",
      minScore: 1,
      maxScore: 3
    },
    {
      id: "subtract-3",
      name: "不讲卫生",
      minScore: 1,
      maxScore: 2
    },
    {
      id: "subtract-4",
      name: "违约拖延",
      minScore: 2,
      maxScore: 5
    }
  ]
};

export function getScoreRanges(): ScoreRange[] {
  return scoreRanges;
}

export function getScoreRangeByScore(score: number): ScoreRange | null {
  const ranges = getScoreRanges();
  return ranges.find(
    (range) => score >= range.minScore && score <= range.maxScore
  ) || null;
}

export function getRewardsByScore(score: number): Reward[] {
  const range = getScoreRangeByScore(score);
  if (!range) return [];

  return Object.values(range.rewards);
}

export function getAddItems(): ScoreItem[] {
  return scoreItems.addItems;
}

export function getSubtractItems(): ScoreItem[] {
  return scoreItems.subtractItems;
}

export function getRandomScore(item: ScoreItem): number {
  const { minScore, maxScore } = item;
  return Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
}
