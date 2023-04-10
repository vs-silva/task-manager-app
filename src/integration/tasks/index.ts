import {TasksService} from "./tasks.service";
import {MockDataReaderAdapter} from "./adapters/mock-data-reader.adapter";
import {MockDataWriterAdapter} from "./adapters/mock-data-writer.adapter";

export default TasksService(MockDataReaderAdapter(), MockDataWriterAdapter());
