import { log } from '../util/logger';
import { wrapSassContext } from './wrapSassContext';
import { wrapSassOptions } from './wrapSassOptions';

interface SassOptionsInterface {
  /**
   * Property accessor to `sass_option_(get|set)_precision`
   */
  precision: number;

  /**
   * Property accessor to `sass_option_(get|set)_output_style`
   */
  outputStyle: OutputStyle;

  /**
   * Release allocated memory with created instance.
   */
  dispose(): void;
}

/**
 * Supported output style.
 */
enum OutputStyle {
  SASS_STYLE_NESTED,
  SASS_STYLE_EXPANDED,
  SASS_STYLE_COMPACT,
  SASS_STYLE_COMPRESSED
}

/**
 * @internal
 *
 * Interop interface to `sass_option*` api
 * (https://github.com/sass/libsass/blob/master/docs/api-context.md#sass-options-api)
 *
 */
class SassOptions implements SassOptionsInterface {
  /**
   * Raw pointer to `struct Sass_Options*`
   */
  private readonly sassOptionsPtr: number;
  /**
   * Construct new instance of SassOptions.
   *
   * @param {ReturnType<typeof wrapSassContext>} cwrapCtx cwrapped function object to sass context api.
   * @param {ReturnType<typeof wrapSassOptions>} cwrapOptions cwrapped function object to sass option api.
   *
   * Manual creation of this class is prohibited;
   * Should use `context.options.create` static interface instead.
   */
  constructor(
    private readonly cwrapCtx: ReturnType<typeof wrapSassContext>,
    private readonly cwrapOptions: ReturnType<typeof wrapSassOptions>
  ) {
    this.sassOptionsPtr = cwrapCtx.make_options();
    log(`SassOptions: created new instance`, { sassOptionsPtr: this.sassOptionsPtr });
  }

  public get precision(): number {
    return this.cwrapOptions.option_get_precision(this.sassOptionsPtr);
  }
  public set precision(precision: number) {
    this.cwrapOptions.option_set_precision(this.sassOptionsPtr, precision);
  }

  public get outputStyle(): OutputStyle {
    return this.cwrapOptions.option_get_output_style(this.sassOptionsPtr);
  }
  public set outputStyle(style: OutputStyle) {
    this.cwrapOptions.option_set_output_style(this.sassOptionsPtr, style);
  }

  public dispose(): void {
    this.cwrapCtx.delete_options(this.sassOptionsPtr);
    log(`SassOptions: disposed instance`);
  }
}

export { SassOptionsInterface, SassOptions, OutputStyle };
