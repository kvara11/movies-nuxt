<div class="custom-card__col custom-card__col_controls">

    <?php if ($invoice['Invoice']['active'] == '1'): ?>

        <!-- if $invoice['Invoice']['number_string'] != 'HC68'  must be changed to real logic
                                                                this is simulation -->

        <!-- STATE 1: NUOVA / NEW (Draft State)                             -->
        <?php if ($invoice['Invoice']['number_string'] == 'HC68'): ?>
            <div class="hk-controls-wrap">
                <a href="#" class="btn btn-secondary btn-block all_inovice_row-btn">
                    <?php echo $this->Icon->arrow_up_full_icon(); ?>
                    <?php echo __('Carica'); ?>
                    <a>
            </div>
            <div class="hk-controls-wrap">
                <?php
                $has_host = !empty($invoice['Invoice']['host_id']);
                $disabled_attr = $has_host ? 'disabled="disabled"' : '';
                $disabled_modal = $has_host ? '' : 'data-toggle="modal" data-target="#modal-responsive"';
                ?>

                <?php if (empty($invoice['Invoice']['sdi_id']) && $this->UserAuth->HP('Invoices', 'edit')): ?>
                    <a href="/invoices/edit/<?php echo $invoice['Invoice']['hash']; ?>"
                        title="<?php echo __('Modifica'); ?>"
                        target="_blank"
                        class="btn btn-white btn-block all_inovice_row-btn"
                        <?php echo $disabled_modal; ?>
                        <?php echo $disabled_attr; ?>>
                        <?php echo $this->Icon->edit_icon(); ?>
                        <?php echo __('Modifica'); ?>
                    </a>
                <?php endif; ?>

                <a href="#" title="Download" target="_blank" class="btn btn-white all_inovice_download_btn">
                    <?php echo $this->Icon->download_bold_icon(); ?>
                </a>
            </div>

        <?php else: ?>

            <!-- STATE 2: INVIATA A SDI / SENT                                   -->

            <div class="hk-controls-wrap">
                <a href="#" class="btn btn-secondary btn-block all_inovice_row-btn">
                    <?php echo $this->Icon->send_icon(); ?>
                    <?php echo __('Invia a SDI'); ?>
                    <a>
            </div>
            <div class="hk-controls-wrap">
                <a href="#" title="Remove" target="_blank" class="btn btn-white btn-block all_inovice_row-btn">
                    <?php echo $this->Icon->close_new_icon(); ?>
                    <?php echo __('Rimuovi caricata'); ?>
                </a>
                <a href="#" title="Download" target="_blank" class="btn btn-white all_inovice_download_btn">
                    <?php echo $this->Icon->download_bold_icon(); ?>
                </a>
            </div>

        <?php endif; ?>

    <?php else: ?>
        <!-- CARICATA / Uploaded -->
        <div class="hk-controls-wrap">
            <a href="#" class="btn btn-secondary btn-block all_inovice_row-btn">
                <?php echo $this->Icon->download_bold_icon(); ?>
                <?php echo __('Download PDF'); ?>
                <a>
        </div>
        <div class="hk-controls-wrap">
            <a href="#" title="Modifica" target="_blank" class="btn btn-white btn-block all_inovice_row-btn">
                <?php echo $this->Icon->edit_icon(); ?>
                <?php echo __('Modifica stato pagamento'); ?>
            </a>
        </div>
    <?php endif ?>

</div>