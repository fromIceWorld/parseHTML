import {
    compiler,
    compilerToken,
    factory,
    factoryToken,
} from '../eval/generator';
import { Instruction, InstructionToken } from '../eval/instructions';
import { Injector, StaticProvider } from '../Injector/index';
import { Parse } from '../parse/index';
import { PlatformRef } from './application';

const CORE_PROVIDES: StaticProvider[] = [
    { provide: PlatformRef, deps: [Injector], useClass: PlatformRef },
    { provide: Injector, deps: [], useClass: Injector },
    {
        provide: InstructionToken,
        useValue: Instruction,
    },
    {
        provide: compilerToken,
        deps: [Parse, , InstructionToken, factoryToken],
        useClass: compiler,
    },
    {
        provide: factoryToken,
        useValue: factory,
    },
];
const PlatformCore = CORE_PROVIDES;
export { PlatformCore };
