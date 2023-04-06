import {TasksService} from "./tasks.service";
import {MockDataReaderAdapter} from "./adapters/mock-data-reader.adapter";

export default TasksService(MockDataReaderAdapter());
