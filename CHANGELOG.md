## [2.4.1](https://github.com/DasRed/perst/compare/v2.4.0...v2.4.1) (2021-08-20)


### Bug Fixes

* update dep and fixing tests ([aa7b1fa](https://github.com/DasRed/perst/commit/aa7b1fae17559582e9e8e0b2b896b2f72142c02f))

# [2.4.0](https://github.com/DasRed/perst/compare/v2.3.1...v2.4.0) (2020-12-21)


### Features

* changing output name ([6304319](https://github.com/DasRed/perst/commit/63043193177606f575a5c4368ea34e4e48272326))

## [2.3.1](https://github.com/DasRed/perst/compare/v2.3.0...v2.3.1) (2020-12-15)


### Bug Fixes

* fixing default of threshold.avgErrorRate to 0 ([0e29254](https://github.com/DasRed/perst/commit/0e2925455289235354556ca02f8df769a14a5e41))

# [2.3.0](https://github.com/DasRed/perst/compare/v2.2.1...v2.3.0) (2020-12-14)


### Features

* **dump-config:** add syntax highlighting to config dump ([2a36751](https://github.com/DasRed/perst/commit/2a36751751134f6caa091fdb2e26419f6b67f2c3))

## [2.2.1](https://github.com/DasRed/perst/compare/v2.2.0...v2.2.1) (2020-12-11)


### Bug Fixes

* update loader.io.api version ([662a29e](https://github.com/DasRed/perst/commit/662a29e7c837b902bc1ea23627affe8384d65bd8))

# [2.2.0](https://github.com/DasRed/perst/compare/v2.1.0...v2.2.0) (2020-12-11)


### Features

* **#10:** resolve [#10](https://github.com/DasRed/perst/issues/10) : add cli option '--stop-on-failure' ([b6c9c6b](https://github.com/DasRed/perst/commit/b6c9c6ba5c604890f245525cb17a46564393584d))
* **#8:** resolve [#8](https://github.com/DasRed/perst/issues/8) list all tasks which are available ([eefb5ef](https://github.com/DasRed/perst/commit/eefb5ef60acb7a1b174d4c2c79882659d9f3b0ef))
* **#9:** resolve [#9](https://github.com/DasRed/perst/issues/9) : add cli option `--silent` ([dd6bc24](https://github.com/DasRed/perst/commit/dd6bc245db6598a4219ccd9d43f75ec2a1fba5d7))

# [2.1.0](https://github.com/DasRed/perst/compare/v2.0.0...v2.1.0) (2020-12-11)


### Features

* **#6:** resolve [#6](https://github.com/DasRed/perst/issues/6) : cli parameter (regex) which filters the test, which should be executed ([05ba082](https://github.com/DasRed/perst/commit/05ba082fd9b8ee79305cfe84aeb1656009c804bc))
* **#6:** resolve [#6](https://github.com/DasRed/perst/issues/6) : cli parameter (regex) which filters the test, which should be executed ([ae06902](https://github.com/DasRed/perst/commit/ae06902a2e1ead39d044c84d20ae278b188c3acc))
* **#7:** resolve [#7](https://github.com/DasRed/perst/issues/7) : adding color and no-color options to ([6818e7d](https://github.com/DasRed/perst/commit/6818e7dcca6ef17149887c205115a2ef3091744e))

# [2.0.0](https://github.com/DasRed/perst/compare/v1.2.0...v2.0.0) (2020-12-10)


### Bug Fixes

* fixing variable source values ([4498561](https://github.com/DasRed/perst/commit/4498561b1e482c3c4cad384bf64709d10c48fb1e))


### Features

* **#5:** resolve [#5](https://github.com/DasRed/perst/issues/5) Parameters from request should be an array with the keys name and value like variables ([f28eb7e](https://github.com/DasRed/perst/commit/f28eb7edcadc8e1dfc19797d0482033b500ceb58))
* **#5:** resolve [#5](https://github.com/DasRed/perst/issues/5) Parameters from request should be an array with the keys name and value like variables ([d2f0680](https://github.com/DasRed/perst/commit/d2f0680d24f7c8c2700797e5f589cd49150879df))


### BREAKING CHANGES

* **#5:** config structure has changed

# [1.2.0](https://github.com/DasRed/perst/compare/v1.1.1...v1.2.0) (2020-12-09)


### Bug Fixes

* fixies in task creation ([597632d](https://github.com/DasRed/perst/commit/597632d106595756f32b383c9dc527c944aa1d57))
* fixing task options avgErrorRate in threshold objec ([554f8a7](https://github.com/DasRed/perst/commit/554f8a7a7f19f6bdce3a7adb8a208ab6574af0d8))
* refactor parameter handling and fixing return of run command ([4e5617c](https://github.com/DasRed/perst/commit/4e5617c282139e6c8f3fb5cd984f1dbcbe59cd02))


### Features

* **#1:** adding a version information to the perst config structure [#1](https://github.com/DasRed/perst/issues/1) resolved ([88caa89](https://github.com/DasRed/perst/commit/88caa89dde802eea9081d0fef3ca42c8629d5e3b))
* **#2:** resolved [#2](https://github.com/DasRed/perst/issues/2): allowing multiple request for a task ([543621b](https://github.com/DasRed/perst/commit/543621b419a38ff6b5fc384e5207e06948a51970))
* **#3:** resolve [#3](https://github.com/DasRed/perst/issues/3): dump the config ([0e514f5](https://github.com/DasRed/perst/commit/0e514f5815d91a8859c75626f40c1f87bceb16e6))
* **#4:** resolve [#4](https://github.com/DasRed/perst/issues/4) allow yaml anchors ([2175084](https://github.com/DasRed/perst/commit/217508472e86aeff90be2978cc8d846db6444601))
* **#4:** resolved [#4](https://github.com/DasRed/perst/issues/4): allowing multiple request for a task ([d079905](https://github.com/DasRed/perst/commit/d079905c910774dbfde12ab7cd6d686bfad5e8dc))
* **#4:** resolved [#4](https://github.com/DasRed/perst/issues/4): allowing multiple request for a task ([b2ca514](https://github.com/DasRed/perst/commit/b2ca5142d1c28175e529ccfea751af02e2710b7a))

## [1.1.1](https://github.com/DasRed/perst/compare/v1.1.0...v1.1.1) (2020-12-03)


### Bug Fixes

* better ci and none ci stdout output ([2221c82](https://github.com/DasRed/perst/commit/2221c82887f43c1ff1723806dc76d9b627270b6c))

# [1.1.0](https://github.com/DasRed/perst/compare/v1.0.2...v1.1.0) (2020-12-03)


### Features

* adding ci options ([62e8029](https://github.com/DasRed/perst/commit/62e8029729b378c7e2d25f3b990b10dba0dc958f))

## [1.0.2](https://github.com/DasRed/perst/compare/v1.0.1...v1.0.2) (2020-12-03)


### Bug Fixes

* releases handling ([e32a47e](https://github.com/DasRed/perst/commit/e32a47eb9c7450f4f8c30ac72ecfb20d93aa8ca6))

## [1.0.1](https://github.com/DasRed/perst/compare/v1.0.0...v1.0.1) (2020-12-03)


### Bug Fixes

* removing unused dependencies ([8cec2fc](https://github.com/DasRed/perst/commit/8cec2fccb9954dc67365100190f32db9044a9b9a))
* writing to console ([d7855ca](https://github.com/DasRed/perst/commit/d7855ca88fb11e176b73ab9353176f64306405d2))
* writing to console ([1d3583c](https://github.com/DasRed/perst/commit/1d3583c984f2f68571e50b89da861d948bbf2f88))

# 1.0.0 (2020-12-03)


### Bug Fixes

* fixing coverage generation ([324ca59](https://github.com/DasRed/perst/commit/324ca595bc4434cdfa48f7178dfff0b8f815c9b1))
* removing top level awaits because jest does not handle this for the coverage ([36d86ec](https://github.com/DasRed/perst/commit/36d86ecdceec811c10c07ceb75a250295450a1b3))
* setting correct version ([2538ddc](https://github.com/DasRed/perst/commit/2538ddc67a4c3d9ab206f4ec5c913be460c7b97a))
* setting correct version ([1c797ed](https://github.com/DasRed/perst/commit/1c797ed533408eaab902ae462b9a99bbfa3bf10e))
* update loaderio and adding some test ([7fb8008](https://github.com/DasRed/perst/commit/7fb8008fee7329fbfd53a66c78c217f8edea2e89))
* update loaderio and improving build and bin ([ed10678](https://github.com/DasRed/perst/commit/ed106785256133dda29749ad984a7e9f06308bee))


### Features

* cli arguments, adding dryRun ([74863c4](https://github.com/DasRed/perst/commit/74863c40ef65d0acf97a0067c7f483078820e403))
* cli arguments, adding dryRun ([bd42388](https://github.com/DasRed/perst/commit/bd4238810cd62e9eda08b3571810a7c03ad3c17e))
* cli arguments, adding dryRun ([3939714](https://github.com/DasRed/perst/commit/39397143595b031f7bd9d02f4ea6636545523e1e))
* implementing perst ([edd436c](https://github.com/DasRed/perst/commit/edd436ca1909ebf2602d47146b60419e887a12a2))


### BREAKING CHANGES

* versioning
