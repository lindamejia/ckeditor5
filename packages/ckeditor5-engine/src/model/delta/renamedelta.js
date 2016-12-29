/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module engine/model/delta/renamedelta
 */

import Delta from './delta';
import DeltaFactory from './deltafactory';
import { register } from '../batch';
import RenameOperation from '../operation/renameoperation';
import Element from '../element';
import Position from '../position';
import CKEditorError from 'ckeditor5-utils/src/ckeditorerror';

/**
 * To provide specific OT behavior and better collisions solving, the {@link module:engine/model/batch~Batch#rename Batch#rename} method
 * uses the `RenameDelta` class which inherits from the `Delta` class and may overwrite some methods.
 */
export default class RenameDelta extends Delta {
	/**
	 * @inheritDoc
	 */
	get _reverseDeltaClass() {
		return RenameDelta;
	}

	/**
	 * @inheritDoc
	 */
	static get className() {
		return 'engine.model.delta.RenameDelta';
	}
}

function apply( batch, delta, operation ) {
	delta.addOperation( operation );
	batch.document.applyOperation( operation );
}

/**
 * Renames given element.
 *
 * @chainable
 * @method module:engine/model/batch~Batch#rename
 * @param {module:engine/model/element~Element} element The element to rename.
 * @param {String} newName New element name.
 */
register( 'rename', function( element, newName ) {
	if ( !( element instanceof Element ) ) {
		/**
		 * Trying to rename an object which is not an instance of Element.
		 *
		 * @error batch-rename-not-element-instance
		 */
		throw new CKEditorError( 'batch-rename-not-element-instance: Trying to rename an object which is not an instance of Element.' );
	}

	const delta = new RenameDelta();
	this.addDelta( delta );

	apply(
		this, delta,
		new RenameOperation( Position.createBefore( element ), element.name, newName, this.document.version )
	);

	return this;
} );

DeltaFactory.register( RenameDelta );
