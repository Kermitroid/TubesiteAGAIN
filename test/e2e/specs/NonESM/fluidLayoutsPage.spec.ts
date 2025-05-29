import { vpTest } from '../../fixtures/vpTest';
import { getLinkByName } from '../../testData/pageLinksData';
import { ExampleLinkName } from '../../testData/ExampleLinkNames';
import { testFluidLayoutsPageVideoIsPlaying } from '../commonSpecs/fluidLayoutsPageVideoPlaying';

const link = getLinkByName(ExampleLinkName.FluidLayouts);

vpTest(`Test if video on fluid layouts page is playing as expected`, async ({ page, pomPages }) => {
    await testFluidLayoutsPageVideoIsPlaying(page, pomPages, link);
});
