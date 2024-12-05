import React, { useCallback, useEffect, useState } from "react";
import api from "../../../../../../services/api";

import { useFormik } from "formik";
import InputCustom from "../../../../../../components/InputCustom";
import RadioGroupCustom from "../../../../../../components/RadioGroup";
import SelectCustom from "../../../../../../components/SelectCustom";
import Loading from "../../../../../../core/common/Loading";
import { IVeiculos } from "../../../types/types";
import formValidator from "../validators/formValidator";

interface FormValues {
  placa: string;
  id_estado: number | null;
  renavam: string;
  tipoParteVeiculo: boolean;
  rntrc: string;
  dataExpiracaoRNTRC: string;
  anoExercicioCRLV: number | null;
  livreAcessoPatio: boolean;
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IVeiculos;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (values: FormValues, row?: IVeiculos) => {
    try {
      setLoading(true);
      
      const body = {
        id_veiculo: row?.id_veiculo,
        placa: values.placa.replace("-", ""),
        id_estado: values.id_estado,
        renavam:
          String(values.renavam).replaceAll(".", "").replaceAll("-", "")
            .length > 0
            ? String(values.renavam).replaceAll(".", "").replaceAll("-", "")
            : null,
        tipo_parte_veiculo: values.tipoParteVeiculo,
        rntrc: values.rntrc !== null && values.rntrc.length > 0 ? values.rntrc : null,
        data_expiracao_rntrc:
          values.dataExpiracaoRNTRC !== null && values.dataExpiracaoRNTRC.length > 0
            ? values.dataExpiracaoRNTRC
            : null,
        ano_exercicio_crlv: values.anoExercicioCRLV,
        livre_acesso_patio: values.livreAcessoPatio,
        ativo: values.ativo,
        id_usuario_historico: 1,
        status: 1,
      };

      if (props.isEdit) {
        await api.post("/editar/veiculos", body);
      } else {
        await api.post("/cadastrar/veiculos", body);
      }

      setLoading(false);

      props.onConfirm();
    } catch {
      setLoading(false);
    }
  }, []);

  const getStates = useCallback(async () => {
    try {
      const response = await api.post("/listar/estados");

      const mappingData = response.data.map((rows: any) => {
        return {
          id: rows.id_estado,
          label: rows.nome,
        };
      });

      setStates(mappingData);

      console.log(response.data);
    } catch {}
  }, []);

  const onLoadFormValues = useCallback((row: any) => {
    const data = row;

    if (data) {
      formik.setFieldValue("placa", data.placa);
      formik.setFieldValue("id_estado", data.id_estado);
      formik.setFieldValue("renavam", data.renavam);
      formik.setFieldValue("tipoParteVeiculo", data.tipo_parte_veiculo);
      formik.setFieldValue("rntrc", data.rntrc);
      formik.setFieldValue("dataExpiracaoRNTRC", data.data_expiracao_rntrc);
      formik.setFieldValue("anoExercicioCRLV", data.ano_exercicio_crlv);
      formik.setFieldValue("livreAcessoPatio", data.livre_acesso_patio);
      formik.setFieldValue("ativo", data.ativo);
    }

    console.log(data);
  }, []);

  const initialValues: FormValues = {
    placa: "",
    id_estado: null,
    renavam: "",
    tipoParteVeiculo: false,
    rntrc: "",
    dataExpiracaoRNTRC: "",
    anoExercicioCRLV: null,
    livreAcessoPatio: false,
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  useEffect(() => {
    getStates();
  }, [getStates]);

  useEffect(() => {
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <InputCustom
            title="Placa"
            typeInput="mask"
            mask="aaa-9*99"
            placeholder="AAA-0000 OU AAA-0A00"
            onChange={formik.handleChange("placa")}
            touched={formik.touched.placa}
            error={formik.errors.placa}
            value={formik.values.placa}
            disabled={props.isView}
          />
        </div>
        <div>
          <SelectCustom
            data={states}
            onChange={(selectedOption: any) =>
              formik.setFieldValue("id_estado", selectedOption.id)
            }
            title="Estado"
            touched={formik.touched.id_estado}
            error={formik.errors.id_estado}
            disabled={props.isView}
            value={formik.values.id_estado}
          />
        </div>
        <div>
          <InputCustom
            title="Renavam"
            typeInput="mask"
            mask="99.99.99.99.99-9"
            placeholder="00.00.00.00.00-0"
            onChange={formik.handleChange("renavam")}
            touched={formik.touched.renavam}
            error={formik.errors.renavam}
            value={formik.values.renavam}
            disabled={props.isView}
          />
        </div>
        <div>
          <RadioGroupCustom
            title="Motorizado"
            onChange={(value: string) =>
              formik.setFieldValue("tipoParteVeiculo", value === "true")
            }
            value={formik.values.tipoParteVeiculo}
            disabled={props.isView}
          />
        </div>
        <div>
          <InputCustom
            title="RNTRC"
            placeholder=""
            onChange={formik.handleChange("rntrc")}
            touched={formik.touched.rntrc}
            error={formik.errors.rntrc}
            disabled={props.isView}
          />
        </div>
        <div>
          <InputCustom
            title="Expiração do RNTRC"
            type="date"
            placeholder=""
            onChange={formik.handleChange("dataExpiracaoRNTRC")}
            touched={formik.touched.dataExpiracaoRNTRC}
            error={formik.errors.dataExpiracaoRNTRC}
            value={formik.values.dataExpiracaoRNTRC}
            disabled={props.isView}
          />
        </div>
        <div>
          <InputCustom
            title="Ano Exercício CRLV"
            type="number"
            placeholder=""
            onChange={formik.handleChange("anoExercicioCRLV")}
            touched={formik.touched.anoExercicioCRLV}
            error={formik.errors.anoExercicioCRLV}
            value={formik.values.anoExercicioCRLV}
            disabled={props.isView}
          />
        </div>
        <div>
          <RadioGroupCustom
            title="Livre Acesso ao Pátio"
            onChange={(value: string) =>
              formik.setFieldValue("livreAcessoPatio", value === "true")
            }
            value={formik.values.livreAcessoPatio}
            disabled={props.isView}
          />
        </div>
        <div>
          <RadioGroupCustom
            title="Ativo"
            onChange={(value: string) =>
              formik.setFieldValue("ativo", value === "true")
            }
            value={formik.values.ativo}
            disabled={props.isView}
          />
        </div>
      </div>
      {!props.isView && (
        <div className="flex items-center mt-4">
          <button
            type="button"
            className="w-full h-14 bg-[#003459] text-base text-[#fff] rounded-md mr-2"
            onClick={() => formik.handleSubmit()}
          >
            Salvar
          </button>
          <button
            type="button"
            className="w-full h-14 bg-[#9D9FA1] text-base text-[#fff] rounded-md"
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};

export default Form;