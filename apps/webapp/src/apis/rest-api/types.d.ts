declare module 'rest-api' {
  export interface TimeModel {
    createTime: string;
    updateTime: string;
  }

  export interface IdModel extends TimeModel {
    id: string;
  }

  export interface InfoModel extends IdModel {
    name: string;
    description: string;
  }

  export interface RestFilter {
    pageNum: number;
    pageSize: number;
    id: string;
    ids: string[];
    name: string;
    names: string[];
    startTime: string;
    endTime: string;
  }
}
