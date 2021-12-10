import * as TableService from '../service/table';

export default {
  namespace: 'table',

  state: {
    TableList: [],
  },

  effects: {
    *queryList({ _ }, { call, put }) {
      const rsp = yield call(TableService.queryList);
      yield put({ type: 'saveList', payload: { TableList: rsp.result } });
    },
    *deleteOne({ payload }, { call, put }) {
      const rsp = yield call(TableService.deleteOne, payload);
      console.log('deleteOne');
      yield put({ type: 'queryList' });
      return rsp;
    },
    *addOne({ payload }, { call, put }) {
      const rsp = yield call(TableService.addOne, payload);
      yield put({ type: 'queryList' });
      return rsp;
    },
  },

  reducers: {
    saveList(state, { payload: { TableList } }) {
      return {
        ...state,
        TableList,
      };
    },
  },
};
